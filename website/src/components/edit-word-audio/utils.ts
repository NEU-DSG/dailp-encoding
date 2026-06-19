import { CognitoUser } from "amazon-cognito-identity-js"
import { useMemo, useState } from "react"
import { useUser } from "src/auth"
import * as Dailp from "../../graphql/dailp"
import { ContributorAudioMetadata, S3Uploader } from "../../utils/s3"

type UploadAudioState = "ready" | "uploading" | "error"

// Relational context a panel can attach to its audio uploads.
export interface AudioUploadRelations {
  wordId?: string
  documentId?: string
}

export function useAudioUpload(
  processUploadedAudio: (resourceUrl: string) => Promise<boolean>,
  relations?: AudioUploadRelations
) {
  const [uploadAudioState, setUploadAudioState] =
    useState<UploadAudioState>("ready")
  const { user } = useUser()

  /**
   * Try to upload the audio.
   *
   * Returns success boolean and updates state to ready or error
   */
  async function uploadAudio(data: Blob) {
    setUploadAudioState("uploading")
    try {
      const { resourceUrl } = await uploadContributorAudioToS3(user!, data, {
        ...relations,
        speakerId: user!.getUsername(),
      })
      // const resourceUrl = "https://" + prompt("url?")
      const success = await processUploadedAudio(resourceUrl)
      if (!success) {
        console.log("Failed to process uploaded audio at", resourceUrl)
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
  }

  function clearError() {
    // only map "error" -> "ready" otherwise do nothing
    setUploadAudioState((s) => (s === "error" ? "ready" : s))
  }

  // `as const` makes sure this gets typed as a tuple, not a list with a union type
  return [uploadAudio, uploadAudioState, clearError] as const
}

export async function uploadContributorAudioToS3(
  user: CognitoUser,
  data: Blob,
  meta?: ContributorAudioMetadata
) {
  const uploader = new S3Uploader(user)
  return uploader.uploadContributorAudio(data, meta)
}
