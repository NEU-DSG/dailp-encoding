import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity"
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity"
import { CognitoUser } from "amazon-cognito-identity-js"
import { useMemo, useState } from "react"
import { v4 } from "uuid"
import { useUser } from "src/auth"
import * as Dailp from "../../graphql/dailp"

type UploadAvatarState = "ready" | "uploading" | "error"

export function useAvatarUpload() {
  const [uploadAvatarState, setUploadAvatarState] =
    useState<UploadAvatarState>("ready")
  const { user } = useUser()
  const [_updateUserResult, updateUser] = Dailp.useUpdateCurrentUserMutation()

  /**
   * Try to upload the avatar.
   *
   * Returns success boolean and updates state to ready or error
   */
  const uploadAvatar = useMemo(
    () =>
      async function (data: Blob, filename: string) {
        setUploadAvatarState("uploading")
        try {
          const { resourceUrl } = await uploadAvatarToS3(user!, data, filename)

          // Update user profile with new avatar URL
          const result = await updateUser({
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
    [user, updateUser]
  )

  function clearError() {
    // only map "error" -> "ready" otherwise do nothing
    setUploadAvatarState((s) => (s === "error" ? "ready" : s))
  }

  // `as const` makes sure this gets typed as a tuple, not a list with a union type
  return [uploadAvatar, uploadAvatarState, clearError] as const
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
