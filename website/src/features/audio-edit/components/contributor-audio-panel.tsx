import cx from "classnames"
import { ReactElement, ReactNode } from "react"
import { IconType } from "react-icons"
import { CollapsiblePanel } from "src/features/documents/components/word-panel"
import * as Dailp from "src/graphql/dailp"
import * as css from "src/ui/organisms/panel-layout/panel-layout.css"
import {
  contributeAudioContainer,
  statusMessage,
  statusMessageError,
} from "./contributor.css"
import { useAudioUpload } from "./utils"

export function ContributeAudioPanel(p: {
  panelTitle: string
  Icon: IconType
  Component: ContributeAudioComponent
  word: Dailp.FormFieldsFragment
}) {
  return (
    <CollapsiblePanel
      title={p.panelTitle}
      content={<ContributeAudioSection word={p.word} Component={p.Component} />}
      icon={<p.Icon size={24} className={css.wordPanelButton.colpleft} />}
    />
  )
}

type ContributeAudioComponent = (p: {
  uploadAudio: (blob: Blob) => Promise<boolean>
}) => ReactElement

/**
 * This wrapper component provides upload functionality and feedback for an
 * audio contribution component.
 */
function ContributeAudioSection(p: {
  word: Dailp.FormFieldsFragment
  Component: ContributeAudioComponent
}): ReactElement {
  const [uploadAudio, uploadState, clearUploadError] = useAudioUpload(p.word.id)

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
