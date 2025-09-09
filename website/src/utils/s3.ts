import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity"
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity"
import { CognitoUser } from "amazon-cognito-identity-js"
import { v4 } from "uuid"

interface S3UploadConfig {
  bucket: string
  keyPrefix: string
  contentType?: string
  extension?: string
}

export class S3Uploader {
  private s3Client: S3Client

  constructor(user: CognitoUser) {
    const REGION = process.env["DAILP_AWS_REGION"]

    this.s3Client = new S3Client({
      region: REGION,
      credentials: fromCognitoIdentityPool({
        identityPoolId: process.env["DAILP_IDENTITY_POOL"]!,
        client: new CognitoIdentityClient({ region: REGION }),
        logins: {
          [`cognito-idp.${REGION}.amazonaws.com/${process.env["DAILP_USER_POOL"]}`]:
            user.getSignInUserSession()?.getIdToken().getJwtToken() ?? "",
        },
      }),
    })
  }

  async uploadFile(
    data: File | Blob,
    config: S3UploadConfig
  ): Promise<{ resourceUrl: string; key: string }> {
    const fileName = data instanceof File ? data.name : undefined
    const inferredExt = fileName?.includes(".")
      ? fileName.substring(fileName.lastIndexOf(".") + 1)
      : ""
    const sanitizedExt = (inferredExt || config.extension || "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
    const extension = sanitizedExt ? `.${sanitizedExt}` : ""

    const key = `${config.keyPrefix}/${v4()}${extension}`

    await this.s3Client.send(
      new PutObjectCommand({
        Body: data,
        Bucket: config.bucket,
        Key: key,
        ContentType:
          config.contentType || data.type || "application/octet-stream",
      })
    )

    return {
      resourceUrl: `${process.env["CF_URL"]}/${key}`,
      key,
    }
  }

  // Convenience methods for common upload types
  async uploadContributorAudio(
    data: Blob
  ): Promise<{ resourceUrl: string; key: string }> {
    const bucket = `dailp-${process.env["TF_STAGE"] || "dev"}-media-storage`
    return this.uploadFile(data, {
      bucket,
      keyPrefix: "user-uploaded-audio",
      contentType: "audio/wav", // or detect from blob
    })
  }

  async uploadCollectionThumbnail(
    data: File
  ): Promise<{ resourceUrl: string; key: string }> {
    const bucket = `dailp-${process.env["TF_STAGE"] || "dev"}-media-storage`
    return this.uploadFile(data, {
      bucket,
      keyPrefix: "user-uploaded-images/collection-thumbnails",
      contentType: data.type,
    })
  }
}
