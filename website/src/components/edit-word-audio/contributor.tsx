import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity"
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity"
import { CognitoUser } from "amazon-cognito-identity-js"
import { ChangeEvent, ReactElement, useEffect, useMemo, useState } from "react"
import { MdRecordVoiceOver, MdUploadFile } from "react-icons/md/index"
import { VisuallyHidden } from "reakit"
import { v4 } from "uuid"
import { AudioPlayer, CleanButton } from ".."
import { useUser, useUserId } from "../../auth"
import * as Dailp from "../../graphql/dailp"
import { WordAudio } from "../../panel-layout"
import {
  MediaPermissionStatus,
  useMediaRecorder,
} from "../../use-media-recorder"
import { IconTextButton } from "../button"
import { SubtleButton } from "../subtle-button"
import { subtleButton, subtleButtonActive } from "../subtle-button.css"

function useAudioUpload(wordId: string) {
  const { user } = useUser()
  const [_contributeAudioResult, contributeAudio] =
    Dailp.useAttachAudioToWordMutation()

  const uploadAudio = useMemo(
    () =>
      async function (data: Blob) {
        const { resourceUrl } = await uploadContributorAudioToS3(user!, data)
        await contributeAudio({
          input: {
            wordId,
            contributorAudioUrl: resourceUrl,
          },
        })
      },
    [user, contributeAudio, wordId]
  )

  return uploadAudio
}

export function ContributorEditWordAudio(p: {
  word: Dailp.FormFieldsFragment
}) {
  const userId = useUserId()
  const [currentTab, setCurrentTab] = useState<"upload" | "record">()
  const [selectedFile, setSelectedFile] = useState<File>()
  const uploadAudio = useAudioUpload(p.word.id)

  function onFileChanged(event: ChangeEvent<HTMLInputElement>) {
    if (!event.currentTarget.files) return

    const [file] = event.currentTarget.files
    if (!file) return
    console.log("New file selected", file)
    setSelectedFile(file)
    setCurrentTab("upload")
  }

  const curatedAudioContent = p.word.editedAudio.length > 0 && (
    <>
      <strong>Curated audio (shown to all readers)</strong>
      <WordAudio word={p.word} />
    </>
  )

  const [audioByUser, audioByOthers] = p.word.userContributedAudio.reduce<
    [
      Dailp.FormFieldsFragment["userContributedAudio"],
      Dailp.FormFieldsFragment["userContributedAudio"]
    ]
  >(
    ([self, other], audio) =>
      audio.recordedBy?.id === userId
        ? [[...self, audio], other]
        : [self, [...other, audio]],
    [[], []]
  )

  const userAudioContent = audioByUser.length > 0 && (
    <>
      <strong>Audio you've contributed</strong>
      {audioByUser.map((audio) => (
        <AudioPlayer
          audioUrl={audio.resourceUrl}
          slices={
            audio.startTime && audio.endTime
              ? {
                  start: audio.startTime,
                  end: audio.endTime,
                }
              : undefined
          }
          showProgress
        />
      ))}
    </>
  )

  const otherUserAudioContent = audioByOthers.length > 0 && (
    <>
      <strong>Audio from other speakers</strong>
      {audioByOthers.map((audio) => (
        <AudioPlayer
          audioUrl={audio.resourceUrl}
          slices={
            audio.startTime && audio.endTime
              ? {
                  start: audio.startTime,
                  end: audio.endTime,
                }
              : undefined
          }
          showProgress
        />
      ))}
    </>
  )

  return (
    <div>
      {[curatedAudioContent, userAudioContent, otherUserAudioContent]
        .filter((content) => content !== false)
        .map((content, idx) => (
          <>
            {idx > 0 && <hr />}
            {content}
          </>
        ))}
      <VisuallyHidden>
        <input type="file" id="file-upload" onChange={onFileChanged} />
      </VisuallyHidden>
      <div
        style={{
          display: "flex",
          textAlign: "center",
          justifyContent: "space-between",
        }}
      >
        <label htmlFor="file-upload" style={{ display: "inline-block" }}>
          <IconTextButton
            icon={<MdUploadFile />}
            className={
              currentTab === "upload" ? subtleButtonActive : subtleButton
            }
          >
            Upload audio
          </IconTextButton>
        </label>
        <div style={{ display: "inline-block" }}>
          <IconTextButton
            icon={<MdRecordVoiceOver />}
            className={
              currentTab === "record" ? subtleButtonActive : subtleButton
            }
            onClick={() => {
              setCurrentTab("record")
            }}
          >
            <span>Record audio</span>
          </IconTextButton>
        </div>
      </div>

      {currentTab === "upload" && (
        <UploadAudioSection
          selectedFile={selectedFile}
          uploadAudio={uploadAudio}
        />
      )}

      {currentTab === "record" && (
        <RecordAudioSection uploadAudio={uploadAudio} />
      )}
    </div>
  )
}

function UploadAudioSection({
  selectedFile,
  uploadAudio,
}: {
  selectedFile?: File
  uploadAudio: (data: Blob) => Promise<void>
}): ReactElement {
  const selectedFileDataUrl = useMemo(
    () => selectedFile && window.URL.createObjectURL(selectedFile),
    [selectedFile]
  )

  if (!selectedFileDataUrl || !selectedFile)
    return (
      <em>
        No file selected! Hit upload file above to select a file from your
        computer.
      </em>
    )

  return (
    <>
      <em>
        Below is the audio you selected. If you would like to select a different
        file click "Upload audio" again.
      </em>
      <AudioPlayer showProgress audioUrl={selectedFileDataUrl} />
      <CleanButton
        className={subtleButton}
        onClick={() => {
          uploadAudio(selectedFile)
        }}
      >
        Save audio
      </CleanButton>
    </>
  )
}

function RecordAudioSection({
  uploadAudio,
}: {
  uploadAudio: (data: Blob) => Promise<void>
}): ReactElement {
  const {
    permissionStatus,
    recordingStatus,
    startRecording,
    stopRecording,
    clearRecording,
    requestMediaPermissions,
  } = useMediaRecorder()

  useEffect(() => {
    if (permissionStatus === MediaPermissionStatus.UNREQUESTED)
      requestMediaPermissions()
  }, [permissionStatus])

  if (permissionStatus !== MediaPermissionStatus.APPROVED)
    return (
      <em>
        You need to allow DAILP to use your microphone in order to record audio.
      </em>
    )

  return (
    <div>
      <em>
        Below are the controls to record audio on your device now. If you are
        happy with your recording, you can hit "Save audio" below.
      </em>
      {recordingStatus.lastRecording === undefined ? (
        <SubtleButton
          onClick={() =>
            recordingStatus.isRecording ? stopRecording() : startRecording()
          }
        >
          {recordingStatus.isRecording ? "Stop" : "Start"} recording
        </SubtleButton>
      ) : (
        <>
          <AudioPlayer
            audioUrl={recordingStatus.lastRecording.url}
            showProgress
          />
          <div
            style={{
              display: "flex",
              textAlign: "center",
              justifyContent: "space-between",
            }}
          >
            <SubtleButton
              onClick={() => {
                uploadAudio(recordingStatus.lastRecording!.data)
              }}
            >
              Save audio
            </SubtleButton>
            <SubtleButton
              onClick={() => {
                clearRecording()
              }}
            >
              Delete recording
            </SubtleButton>
          </div>
        </>
      )}
    </div>
  )
}

async function uploadContributorAudioToS3(user: CognitoUser, data: Blob) {
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

  return { resourceUrl: `https://d1q0qkah8ttfau.cloudfront.net/${key}` }
}
