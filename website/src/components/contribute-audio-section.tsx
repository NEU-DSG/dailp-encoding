import cx from "classnames"
import { ReactElement, ReactNode } from "react"
import {
  contributeAudioContainer,
  statusMessage,
  statusMessageError,
} from "./contribute-audio-section.css"
import { useAudioUpload } from "./edit-word-audio/utils"

export type ContributeAudioComponent = (p: {
  uploadAudio: (blob: Blob) => Promise<boolean>
}) => ReactElement

/**
 * This wrapper component provides upload functionality and feedback for an
 * audio contribution component.
 */
export function ContributeAudioSection(p: {
  Component: ContributeAudioComponent
  processUploadedAudio: (resourceUrl: string) => Promise<boolean>
}): ReactElement {
  // const [uploadAudio, uploadState, clearUploadError] = useAudioUpload(p.word.id)
  const [uploadAudio, uploadState, clearUploadError] = useAudioUpload(
    p.processUploadedAudio
  )

  return (
    <div className={contributeAudioContainer}>
      <p.Component uploadAudio={uploadAudio} />

      {uploadState === "uploading" && (
        <StatusMessage>
          <p>Uploading...</p>
        </StatusMessage>
      )}

      {uploadState === "error" && (
        <StatusMessage error>
          <p>
            Something went wrong with the upload{" "}
            <button onClick={() => clearUploadError()}>Try again</button>
          </p>
        </StatusMessage>
      )}
    </div>
  )
}

function StatusMessage({
  children,
  error = false,
}: {
  children: ReactNode
  error?: boolean
}) {
  return (
    <div
      className={error ? cx(statusMessage, statusMessageError) : statusMessage}
    >
      {children}
    </div>
  )
}
