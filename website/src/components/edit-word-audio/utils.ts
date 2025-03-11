import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity"
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity"
import { CognitoUser } from "amazon-cognito-identity-js"
import { useMemo, useState } from "react"
import { v4 } from "uuid"
import { useUser } from "src/auth"
import * as Dailp from "../../graphql/dailp"

type UploadAudioState = "ready" | "uploading" | "error"

export function useAudioUpload(
  processUploadedAudio: (resourceUrl: string) => Promise<boolean>
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
      const { resourceUrl } = await uploadContributorAudioToS3(user!, data)
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
  data: Blob
) {
  // Get the Amazon Cognito ID token for the user. 'getToken()' below.
  const REGION = process.env["DAILP_AWS_REGION"]
  // TF Stage matches infra environment names: "dev" "prod" or "uat". If TF_STAGE not found, fall back to dev
  const BUCKET = `dailp-${process.env["TF_STAGE"] || "dev"}-media-storage`
  // let accessToken = user.getSignInUserSession()?.getAccessToken() // 'COGNITO_ID' has the format 'COGNITO_USER_POOL_ID'
  // let loginData = {
  //   [COGNITO_ID]: token,
  // }

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

  const key = `user-uploaded-audio/${v4()}`
  await s3Client.send(
    new PutObjectCommand({
      Body: data,
      Bucket: BUCKET,
      Key: key,
    })
  )

  return { resourceUrl: `https://${process.env["CF_URL"]}/${key}` }
}
