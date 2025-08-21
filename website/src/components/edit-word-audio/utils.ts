import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { Auth } from "aws-amplify"
import { useMemo, useState } from "react"
import { v4 } from "uuid"
import { useUser } from "src/auth"
import * as Dailp from "../../graphql/dailp"

type UploadAudioState = "ready" | "uploading" | "error"

export function useAudioUpload(wordId: string) {
  const [uploadAudioState, setUploadAudioState] =
    useState<UploadAudioState>("ready")
  const { user } = useUser()
  const [_contributeAudioResult, contributeAudio] =
    Dailp.useAttachAudioToWordMutation()

  /**
   * Try to upload the audio.
   *
   * Returns success boolean and updates state to ready or error
   */
  const uploadAudio = useMemo(
    () =>
      async function (data: Blob) {
        setUploadAudioState("uploading")
        try {
          const { resourceUrl } = await uploadContributorAudioToS3(data)
          const result = await contributeAudio({
            input: {
              wordId,
              contributorAudioUrl: resourceUrl,
            },
          })
          if (result.error) {
            console.log(result.error)
            setUploadAudioState("error")
            return false
          }
        } catch (error) {
          console.log(error)
          setUploadAudioState("error")
          return false
        }

        setUploadAudioState("ready")
        return true
      },
    [contributeAudio, wordId]
  )

  function clearError() {
    // only map "error" -> "ready" otherwise do nothing
    setUploadAudioState((s) => (s === "error" ? "ready" : s))
  }

  // `as const` makes sure this gets typed as a tuple, not a list with a union type
  return [uploadAudio, uploadAudioState, clearError] as const
}

export async function uploadContributorAudioToS3(data: Blob) {
  // Get the Amazon Cognito ID token for the user. 'getToken()' below.
  const REGION = process.env["DAILP_AWS_REGION"]
  // TF Stage matches infra environment names: "dev" "prod" or "uat". If TF_STAGE not found, fall back to dev
  const BUCKET = `dailp-${process.env["TF_STAGE"] || "dev"}-media-storage`
  // let accessToken = user.getSignInUserSession()?.getAccessToken() // 'COGNITO_ID' has the format 'COGNITO_USER_POOL_ID'
  // let loginData = {
  //   [COGNITO_ID]: token,
  // }
  try {
    const credentials = await Auth.currentCredentials()

    const s3Client = new S3Client({
      region: REGION,
      credentials: Auth.essentialCredentials(credentials),
    })

    const key = `user-uploaded-audio/${v4()}`
    await s3Client.send(
      new PutObjectCommand({
        Body: data,
        Bucket: BUCKET,
        Key: key,
      })
    )

    return { resourceUrl: `https://${process.env["CF_URL"]}/${key}` }
  } catch (error) {
    console.error("Error uploading to S3:", error)
    throw error
  }
}
