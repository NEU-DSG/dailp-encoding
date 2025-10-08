import { CognitoUser } from "amazon-cognito-identity-js"
import { useMemo, useState } from "react"
import { useUser } from "../../../auth"
import * as Dailp from "../../../../graphql/dailp"
import { S3Uploader } from "../../../../utils/s3"

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
          const { resourceUrl } = await uploadContributorAudioToS3(user!, data)
          // const resourceUrl = "https://" + prompt("url?")
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
    [user, contributeAudio, wordId]
  )

  function clearError() {
    // only map "error" -> "ready" otherwise do nothing
    setUploadAudioState((s) => (s === "error" ? "ready" : s))
  }

  // `as const` makes sure this gets typed as a tuple, not a list with a union type
  return [uploadAudio, uploadAudioState, clearError] as const
}

export async function uploadContributorAudioToS3(
  user: CognitoUser,
  data: Blob
) {
  const uploader = new S3Uploader(user)
  return uploader.uploadContributorAudio(data)
}
