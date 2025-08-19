import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity"
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity"
import { CognitoUser } from "amazon-cognito-identity-js"
import { v4 } from "uuid"

export async function uploadCollectionCoverToS3(user: CognitoUser, data: File) {
  const REGION = process.env["DAILP_AWS_REGION"]
  const BUCKET = `dailp-dev-media-storage`
  const fileName = data.name || "upload"
  const inferredExt = fileName.includes(".")
    ? fileName.substring(fileName.lastIndexOf(".") + 1)
    : ""
  const sanitizedExt = inferredExt.toLowerCase().replace(/[^a-z0-9]/g, "")
  const extension = sanitizedExt ? `.${sanitizedExt}` : ""
  const key = `user-uploaded-images/collection-thumbnails/${v4()}${extension}`

  const s3Client = new S3Client({
    region: REGION,
    credentials: fromCognitoIdentityPool({
      identityPoolId: process.env["DAILP_IDENTITY_POOL"]!,
      client: new CognitoIdentityClient({
        region: REGION,
      }),
      logins: {
        [`cognito-idp.${REGION}.amazonaws.com/${process.env["DAILP_USER_POOL"]}`]:
          user.getSignInUserSession()?.getIdToken().getJwtToken() ?? "",
      },
    }),
  })

  await s3Client.send(
    new PutObjectCommand({
      Body: data,
      Bucket: BUCKET,
      Key: key,
      ContentType: data.type || "application/octet-stream",
    })
  )

  return { resourceURL: `${process.env["CF_URL"]}/${key}` }
}
