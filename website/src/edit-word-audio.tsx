import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity"
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity"
import { CognitoUser } from "amazon-cognito-identity-js"
import { ChangeEvent, ReactElement, useEffect, useMemo, useState } from "react"
import { MdRecordVoiceOver, MdUploadFile } from "react-icons/md/index"
import { VisuallyHidden } from "reakit"
import { v4 } from "uuid"
import { useUser } from "./auth"
import { AudioPlayer } from "./components"
import { Button, CleanButton, IconTextButton } from "./components/button"
import { subtleButton, subtleButtonActive } from "./edit-word-feature.css"
import * as Dailp from "./graphql/dailp"
import { WordAudio } from "./panel-layout"

enum MediaPermissionStatus {
  UNREQUESTED,
  NOT_SUPPORTED,
  PENDING_APPROVAL,
  DENIED,
  APPROVED,
}

type RecordingStatus = {
  isRecording: boolean
  lastRecording?: { data: Blob; url: string }
  currentRecordingChunks: Blob[]
}

type UnapprovedState = {
  permissionStatus: Exclude<
    MediaPermissionStatus,
    MediaPermissionStatus.APPROVED
  >
  recordingStatus?: undefined
  mediaRecorder?: undefined
}

type ApprovedState = {
  permissionStatus: MediaPermissionStatus.APPROVED
  recordingStatus: RecordingStatus
  mediaRecorder: MediaRecorder
}

type UseMediaRecorderState = UnapprovedState | ApprovedState

function useMediaRecorder() {
  const mediaSupported = useMemo(
    () =>
      Boolean(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
    []
  )
  const [state, setState] = useState<UseMediaRecorderState>({
    permissionStatus: mediaSupported
      ? MediaPermissionStatus.UNREQUESTED
      : MediaPermissionStatus.NOT_SUPPORTED,
  })

  function requestMediaPermissions() {
    if (
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia &&
      [
        MediaPermissionStatus.UNREQUESTED,
        MediaPermissionStatus.DENIED,
      ].includes(state.permissionStatus)
    ) {
      setState({
        permissionStatus: MediaPermissionStatus.PENDING_APPROVAL,
      })
      navigator.mediaDevices
        .getUserMedia(
          // constraints - only audio needed for this app
          {
            audio: true,
          }
        )

        // Success callback
        .then((stream) => {
          const recorder = new MediaRecorder(stream)
          recorder.ondataavailable = (e) => {
            setState((s) => {
              if (s.permissionStatus !== MediaPermissionStatus.APPROVED)
                return s
              else
                return {
                  ...s,
                  recordingStatus: {
                    ...s.recordingStatus,
                    currentRecordingChunks: [
                      ...s.recordingStatus.currentRecordingChunks,
                      e.data,
                    ],
                  },
                }
            })
          }
          recorder.onstop = (e) => {
            setState((s) => {
              if (
                s.permissionStatus !== MediaPermissionStatus.APPROVED ||
                s.recordingStatus.isRecording === false
              )
                return s

              const recordingBlob = new Blob(
                s.recordingStatus.currentRecordingChunks,
                {
                  // what is the correct spec here?
                  type: "audio/ogg; codecs=opus",
                }
              )

              return {
                ...s,
                recordingStatus: {
                  ...s.recordingStatus,
                  isRecording: false,
                  currentRecordingChunks: [],
                  lastRecording: {
                    data: recordingBlob,
                    url: window.URL.createObjectURL(recordingBlob),
                  },
                },
              }
            })
          }

          setState({
            mediaRecorder: recorder,
            permissionStatus: MediaPermissionStatus.APPROVED,
            recordingStatus: {
              isRecording: false,
              currentRecordingChunks: [],
            },
          })
        })

        // Error callback
        .catch((err) => {
          setState({
            permissionStatus: MediaPermissionStatus.DENIED,
          })
        })
    }
  }

  if (state.permissionStatus !== MediaPermissionStatus.APPROVED)
    return {
      permissionStatus: state.permissionStatus,
      requestMediaPermissions,
    }
  else
    return {
      permissionStatus: state.permissionStatus,
      recordingStatus: state.recordingStatus,
      startRecording() {
        // don't restart recording...?
        if (state.recordingStatus.isRecording) return

        setState({
          ...state,
          recordingStatus: { ...state.recordingStatus, isRecording: true },
        })
        state.mediaRecorder.start()
      },
      stopRecording() {
        // don't stop recording if we aren't recording
        if (!state.recordingStatus.isRecording) return
        state.mediaRecorder.stop()
      },
    }
}

export const EditWordAudio = (p: { word: Dailp.FormFieldsFragment }) => {
  const [currentTab, setCurrentTab] = useState<"upload" | "record">()
  const [selectedFile, setSelectedFile] = useState<File>()

  function onFileChanged(event: ChangeEvent<HTMLInputElement>) {
    if (!event.currentTarget.files) return

    const [file] = event.currentTarget.files
    if (!file) return
    console.log("New file selected", file)
    setSelectedFile(file)
    setCurrentTab("upload")
  }

  return (
    <div>
      <WordAudio word={p.word} />
      {/* todo make this pretty (below) */}
      {/* <IconTextButton icon={<MdOutlineLibraryMusic />} as={IconButton}>
        Choose from contributions
      </IconTextButton>

      <IconTextButton icon={<MdUploadFile />} as={IconButton}>
        Upload from your computer
      </IconTextButton> */}
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
            as={"div"}
          >
            <span>Upload audio</span>
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
        <UploadAudioSection selectedFile={selectedFile} />
      )}

      {currentTab === "record" && <RecordAudioSection />}
    </div>
  )
}

function UploadAudioSection({
  selectedFile,
}: {
  selectedFile?: File
}): ReactElement {
  const { user } = useUser()

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
      <AudioPlayer showProgress audioUrl={selectedFileDataUrl} />
      <CleanButton
        className={subtleButton}
        onClick={() => {
          user && uploadToS3(user, selectedFile)
        }}
      >
        Upload to s3
      </CleanButton>
    </>
  )
}

function RecordAudioSection(): ReactElement {
  const { user } = useUser()

  const {
    permissionStatus,
    recordingStatus,
    startRecording,
    stopRecording,
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
      <Button
        onClick={() =>
          recordingStatus.isRecording ? stopRecording() : startRecording()
        }
      >
        {recordingStatus.isRecording ? "Stop" : "Start"} recording
      </Button>
      {recordingStatus.lastRecording && (
        <>
          <AudioPlayer
            audioUrl={recordingStatus.lastRecording.url}
            showProgress
          />
          <Button
            onClick={() => {
              user && uploadToS3(user, recordingStatus.lastRecording!.data)
            }}
          >
            Upload to s3
          </Button>
        </>
      )}
    </div>
  )
}

function uploadToS3(user: CognitoUser, data: Blob) {
  // Get the Amazon Cognito ID token for the user. 'getToken()' below.
  const REGION = process.env["DAILP_AWS_REGION"]
  console.log(process.env)
  const BUCKET = `dailp-${
    process.env["NODE_ENV"] === "production" ? "prod" : "dev"
  }-media-storage`
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

  s3Client.send(
    new PutObjectCommand({
      Body: data,
      Bucket: BUCKET,
      Key: `user-uploaded-audio/${v4()}`,
    })
  )
}
