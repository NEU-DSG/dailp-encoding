import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity"
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity"
import { CognitoUser } from "amazon-cognito-identity-js"
import { useMemo, useState } from "react"
import { useUser } from "src/auth"
import { S3Uploader } from "src/utils/s3"
import * as Dailp from "../../graphql/dailp"

type UploadAvatarState = "ready" | "uploading" | "error"

export function useAvatarUpload() {
  const [uploadAvatarState, setUploadAvatarState] =
    useState<UploadAvatarState>("ready")
  const { user } = useUser()
  const [{ data: currentUserData }] = Dailp.useCurrentUserQuery()
  const [_updateCurrentUserResult, updateCurrentUser] =
    Dailp.useUpdateCurrentUserMutation()

  /**
   * Try to upload the avatar and delete old one.
   *
   * Returns success boolean and updates state to ready or error
   */
  const uploadAvatar = useMemo(
    () =>
      async function (data: File) {
        setUploadAvatarState("uploading")
        try {
          const uploader = new S3Uploader(user!)
          const bucket = `dailp-${
            process.env["TF_STAGE"] || "dev"
          }-media-storage`
          const userId = user!.getUsername()

          // Upload new avatar
          const { resourceUrl } = await uploader.uploadFile(data, {
            bucket,
            keyPrefix: `user-uploaded-images/profile-images/${userId}`,
            contentType: data.type,
          })

          // Delete old avatar if it exists and is from our S3 bucket.
          // If delete fails, the operation is blocked.
          const currentAvatarUrl = currentUserData?.currentUser?.avatarUrl
          if (
            currentAvatarUrl &&
            currentAvatarUrl.includes(process.env["CF_URL"]!)
          ) {
            const oldKey = extractS3KeyFromUrl(currentAvatarUrl)
            if (oldKey) {
              await uploader.deleteFile(bucket, oldKey)
            }
          }

          // Update user profile with new avatar URL
          const result = await updateCurrentUser({
            user: {
              displayName: "",
              avatarUrl: resourceUrl,
              bio: "",
              organization: "",
              location: "",
            },
          })

          if (result.error) {
            console.log(result.error)
            setUploadAvatarState("error")
            return false
          }
        } catch (error) {
          console.log(error)
          setUploadAvatarState("error")
          return false
        }

        setUploadAvatarState("ready")
        return true
      },
    [user, updateCurrentUser, currentUserData]
  )

  function clearError() {
    // only map "error" -> "ready" otherwise do nothing
    setUploadAvatarState((s) => (s === "error" ? "ready" : s))
  }

  // `as const` makes sure this gets typed as a tuple, not a list with a union type
  return [uploadAvatar, uploadAvatarState, clearError] as const
}

/**
 * Extract S3 key from CloudFront URL
 * Example: https://cloudfront-domain.com/path/to/file.jpg -> path/to/file.jpg
 */
function extractS3KeyFromUrl(url: string): string | null {
  const cfUrl = process.env["CF_URL"]
  if (!cfUrl || !url.includes(cfUrl)) return null

  return url.replace(`https://${cfUrl}/`, "")
}

export async function uploadAvatarToS3(
  user: CognitoUser,
  data: Blob,
  filename: string
) {
  // Validate file size (5MB limit)
  if (data.size > 5 * 1024 * 1024) {
    throw new Error("File too large (max 5MB)")
  }

  // Extract and validate file extension
  const extension = filename.split(".").pop()?.toLowerCase()
  const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp"]

  if (!extension || !allowedExtensions.includes(extension)) {
    throw new Error(
      `Invalid file type. Supported: ${allowedExtensions.join(", ")}`
    )
  }

  // Get the Amazon Cognito ID token for the user
  const REGION = process.env["DAILP_AWS_REGION"]
  // TF Stage matches infra environment names: "dev" "prod" or "uat". If TF_STAGE not found, fall back to dev
  const BUCKET = `dailp-${process.env["TF_STAGE"] || "dev"}-media-storage`

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

  const userId = user.getUsername()
  const key = `user-uploaded-images/profile-images/${userId}.${extension}`

  // Set content type based on extension
  const contentTypeMap: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
  }

  await s3Client.send(
    new PutObjectCommand({
      Body: data,
      Bucket: BUCKET,
      Key: key,
      ContentType: contentTypeMap[extension] || "image/jpeg",
    })
  )

  return { resourceUrl: `https://${process.env["CF_URL"]}/${key}` }
}
