import { ReactElement, useEffect } from "react"
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
}: {
  uploadAudio: (data: Blob) => Promise<boolean>
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

  async function uploadAudioAndReset(data: Blob) {
    if (await uploadAudio(data)) {
      clearRecording?.()
    }
  }

  if (permissionStatus == MediaPermissionStatus.NOT_SUPPORTED)
    return (
      <em>
        Your device or web browser does not support recording audio. Updating
        your device or browser may help.
      </em>
    )

  if (permissionStatus !== MediaPermissionStatus.APPROVED)
    return (
      <>
        <em>
          You need to allow DAILP to use your microphone in order to record
          audio.
        </em>
        <CleanButton onClick={() => requestMediaPermissions()}>
          Click here to grant permission.
        </CleanButton>
      </>
    )

  return (
    <div>
      {recordingStatus.lastRecording === undefined ? (
        <IconTextButton
          icon={
            recordingStatus.isRecording ? (
              <FaRegStopCircle />
            ) : (
              <RiRecordCircleFill color={"#EB606E"} />
            )
          }
          onClick={() =>
            recordingStatus.isRecording ? stopRecording() : startRecording()
          }
          className={subtleButton}
        >
          {recordingStatus.isRecording ? "Stop" : "Start"} recording
        </IconTextButton>
      ) : (
        <>
          <div className={contributeAudioOptions}>
            <SubtleButton
              onClick={() => {
                uploadAudioAndReset(recordingStatus.lastRecording!.data)
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
          <AudioPlayer
            audioUrl={recordingStatus.lastRecording.url}
            showProgress
          />
        </>
      )}
    </div>
  )
}
