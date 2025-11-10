import { CognitoUser } from "amazon-cognito-identity-js"
import { AuthUser } from "src/auth"
import { S3Uploader } from "../../utils/s3"

export async function uploadCollectionCoverToS3(user: AuthUser, data: File) {
  if (user.type === "cognito") {
    // Use direct S3 upload with Cognito credentials
    const uploader = new S3Uploader(user.user)
    return uploader.uploadCollectionThumbnail(data)
  } else {
    return Promise.reject("S3 upload is only supported for Cognito users.")
  }
}
