import { useMemo, useState } from "react"

export enum MediaPermissionStatus {
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

export function useMediaRecorder() {
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
          console.log("couldn't get permission:", err)
          setState({
            permissionStatus: MediaPermissionStatus.DENIED,
          })
        })
    } else {
      console.error(
        "Device or connection does not support user media (no access to user microphone)"
      )
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
      clearRecording() {
        setState((s) =>
          s.recordingStatus
            ? {
                ...s,
                recordingStatus: {
                  ...s.recordingStatus,
                  lastRecording: undefined,
                },
              }
            : s
        )
      },
    }
}
