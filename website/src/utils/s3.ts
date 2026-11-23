import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity"
import { PutObjectCommand, PutObjectCommandOutput, S3Client } from "@aws-sdk/client-s3"
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity"
import { CognitoUser } from "amazon-cognito-identity-js"
import { v4 } from "uuid"



type UploadClient = {
  send(command: PutObjectCommand): Promise<PutObjectCommandOutput | { localResourceUrl: string }>
}

interface S3UploadConfig {
  bucket: string
  keyPrefix: string
  contentType?: string
  extension?: string
}

export class S3Uploader {
  private s3Client: UploadClient

  constructor(user: CognitoUser) {
    const isLocal = process.env["TF_STAGE"] === "local";
    this.s3Client = isLocal ? this.makeLocalClient() : this.makeS3Client(user)
  }

  private makeS3Client(user: CognitoUser): UploadClient {

    const REGION = process.env["DAILP_AWS_REGION"]

    return new S3Client({
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

  private makeLocalClient(): UploadClient {

    return {
      async send({ input: { Key, Body, ContentType } }) {
        if (!Key || !(Body instanceof Blob)) {
          throw new Error("Local uploads require a key and a file or blob")
        }

        const query = new URLSearchParams({ key: Key })
        const signed = await fetch(`/__local-s3/sign?${query}`, { method: "POST" })
        if (!signed.ok) throw new Error(`Could not sign upload (${signed.status})`)

        const url = new URL(await signed.text())
        const uploaded = await fetch(url.toString(), {
          method: "PUT",
          body: Body,
          headers: { "Content-Type": ContentType || "application/octet-stream" },
        })
        if (!uploaded.ok) throw new Error(`Local upload failed (${uploaded.status})`)

        url.search = ""
        return { localResourceUrl: url.toString() }
      },
    }
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

    const result = await this.s3Client.send(
      new PutObjectCommand({
        Body: data,
        Bucket: config.bucket,
        Key: key,
        ContentType:
          config.contentType || data.type || "application/octet-stream",
      })
    )
    // formats the URL to use so we don't do that everywhere
    const resourceUrl = "localResourceUrl" in result
      ? result.localResourceUrl
      : `https://${process.env["CF_URL"]}/${key}`

    return {
      resourceUrl,
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
