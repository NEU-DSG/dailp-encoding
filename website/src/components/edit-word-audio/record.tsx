import {
  ChangeEvent,
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { FaMicrophone, FaRegStopCircle } from "react-icons/fa/index"
import { RiRecordCircleFill } from "react-icons/ri/index"
import { AudioPlayer } from ".."
import * as Dailp from "../../graphql/dailp"
import {
  MediaPermissionStatus,
  useMediaRecorder,
} from "../../use-media-recorder"
import { CleanButton, IconTextButton } from "../button"
import { contributeAudioOptions } from "../contribute-audio-section.css"
import { SubtleButton } from "../subtle-button"
import { subtleButton } from "../subtle-button.css"
import { ContributeAudioPanel } from "./contribute-audio-panel"

const ALLOWED_FORMATS = ["mp3", "wav", "m4a"]

export function RecordWordAudioPanel(p: { word: Dailp.FormFieldsFragment }) {
  return (
    <ContributeAudioPanel
      panelTitle="Record Audio"
      Icon={FaMicrophone}
      Component={RecordAudioContent}
      word={p.word}
    />
  )
}

// TODO: Should this live with ContributeAudioPanel?
export function RecordAudioContent({
  uploadAudio,
  allowFileUpload,
}: {
  uploadAudio: (data: Blob) => Promise<boolean>
  // Optional: adds an "Upload file" button alongside recording, letting the
  // user contribute audio from disk instead of the mic. Currently only used
  // for main document audio.
  allowFileUpload?: boolean
}): ReactElement {
  const {
    permissionStatus,
    recordingStatus,
    startRecording,
    stopRecording,
    clearRecording,
    requestMediaPermissions,
  } = useMediaRecorder()

  const [uploadedAudio, setUploadedAudio] = useState<File>()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Local url to preview an uploaded file
  const uploadedAudioUrl = useMemo(
    () => uploadedAudio && window.URL.createObjectURL(uploadedAudio),
    [uploadedAudio]
  )

  useEffect(() => {
    if (permissionStatus === MediaPermissionStatus.UNREQUESTED)
      requestMediaPermissions()
  }, [permissionStatus])

  async function uploadAudioAndReset(data: Blob) {
    if (await uploadAudio(data)) {
      clearRecording?.()
      setUploadedAudio(undefined)
    }
  }

  // Set uploaded file and make sure format is correct
  function onFileChanged(event: ChangeEvent<HTMLInputElement>) {
    if (!event.currentTarget.files) return

    const [file] = event.currentTarget.files
    if (!file) return

    const fileFormat = file.name.split(".").pop()
    if (!fileFormat || !ALLOWED_FORMATS.includes(fileFormat)) {
      window.alert(
        `The selected file is not of one of the supported formats:\n\t${ALLOWED_FORMATS.join(
          "\n\t"
        )}`
      )
      return
    }

    setUploadedAudio(file)
  }

  const recordButton =
    permissionStatus === MediaPermissionStatus.APPROVED ? (
      <IconTextButton
        icon={
          recordingStatus?.isRecording ? (
            <FaRegStopCircle />
          ) : (
            <RiRecordCircleFill color="#EB606E" />
          )
        }
        onClick={() =>
          recordingStatus?.isRecording ? stopRecording?.() : startRecording?.()
        }
        className={subtleButton}
      >
        {recordingStatus?.isRecording ? "Stop" : "Start"} recording
      </IconTextButton>
    ) : (
      <CleanButton
        className={subtleButton}
        onClick={() => requestMediaPermissions()}
      >
        {permissionStatus === MediaPermissionStatus.PENDING_APPROVAL
          ? "Waiting for permission..."
          : "Enable microphone"}
      </CleanButton>
    )

  // Upload button if prop passed as true
  const uploadButton = allowFileUpload && (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChanged}
        accept={ALLOWED_FORMATS.map((s) => "." + s).join(",")}
        style={{ display: "none" }}
      />
      <SubtleButton onClick={() => fileInputRef.current?.click()}>
        Upload Audio
      </SubtleButton>
    </>
  )

  if (permissionStatus == MediaPermissionStatus.NOT_SUPPORTED)
    return allowFileUpload ? (
      <div>
        <em>
          Your device or web browser does not support recording audio, but you
          can still upload an audio file.
        </em>
        {uploadAudio}
      </div>
    ) : (
      <em>
        Your device or web browser does not support recording audio. Updating
        your device or browser may help.
      </em>
    )

  return (
    <div>
      {recordingStatus?.lastRecording === undefined && !uploadedAudio ? (
        <div className={contributeAudioOptions}>
          {recordButton}
          {uploadButton}
        </div>
      ) : (
        <>
          <div className={contributeAudioOptions}>
            <SubtleButton
              onClick={() => {
                uploadAudioAndReset(
                  uploadedAudio ?? recordingStatus!.lastRecording!.data
                )
              }}
            >
              Save audio
            </SubtleButton>
            <SubtleButton
              onClick={() => {
                clearRecording?.()
                setUploadedAudio(undefined)
              }}
            >
              Delete recording
            </SubtleButton>
          </div>
          <AudioPlayer
            audioUrl={uploadedAudioUrl ?? recordingStatus!.lastRecording!.url}
            showProgress
          />
        </>
      )}
    </div>
  )
}
