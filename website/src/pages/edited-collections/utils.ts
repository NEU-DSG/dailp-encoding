import { CognitoUser } from "amazon-cognito-identity-js"
import { S3Uploader } from "../../utils/s3"

export async function uploadCollectionCoverToS3(user: CognitoUser, data: File) {
  const uploader = new S3Uploader(user)
  return uploader.uploadCollectionThumbnail(data)
}
