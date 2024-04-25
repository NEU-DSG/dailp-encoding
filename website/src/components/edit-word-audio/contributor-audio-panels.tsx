import cx from "classnames"
import { ReactElement, ReactNode } from "react"
import { AiFillSound } from "react-icons/ai"
import * as Dailp from "src/graphql/dailp"
import { CollapsiblePanel } from "src/panel-layout"
import * as css from "../../panel-layout.css"
import {
  contributeAudioContainer,
  statusMessage,
  statusMessageError,
} from "./contributor.css"
import { RecordAudioSection } from "./record"
import { UploadAudioSection } from "./upload"
import { useAudioUpload } from "./utils"

export function ContributorAudioPanels(p: { word: Dailp.FormFieldsFragment }) {
  return (
    <>
      <CollapsiblePanel
        title={"Record Audio"}
        content={
          <ContributeAudioSection
            word={p.word}
            Component={RecordAudioSection}
          />
        }
        icon={
          <AiFillSound size={24} className={css.wordPanelButton.colpleft} />
        }
      />
      <CollapsiblePanel
        title={"Upload Audio"}
        content={
          <ContributeAudioSection
            word={p.word}
            Component={UploadAudioSection}
          />
        }
        icon={
          <AiFillSound size={24} className={css.wordPanelButton.colpleft} />
        }
      />
    </>
  )
}

type ContributeAudioComponent = (p: {
  uploadAudio: (blob: Blob) => Promise<boolean>
}) => ReactElement

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
          <p>Something went wrong with the upload</p>
          <button onClick={() => clearUploadError()}>Try again</button>
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
