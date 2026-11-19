import { FaMicrophone } from "react-icons/fa/index"
import * as Dailp from "src/graphql/dailp"
import { CollapsiblePanel } from "src/word-panel"
import * as css from "../panel-layout.css"
import { ContributeAudioSection } from "./contribute-audio-section"
import { RecordAudioContent } from "./edit-word-audio/record"

const ALLOWED_FORMATS = ["mp3", "wav", "m4a"]

export function RecordDocumentAudioPanel(p: {
  document: Dailp.DocumentFieldsFragment
}) {
  const [_contributeAudioResult, contributeAudio] =
    Dailp.useAttachAudioToDocumentMutation()
  return (
    <CollapsiblePanel
      title="Record Audio"
      content={
        <ContributeAudioSection
          Component={(props) => (
            <RecordAudioContent {...props} allowFileUpload />
          )}
          processUploadedAudio={async (resourceUrl: string) => {
            const result = await contributeAudio({
              input: {
                documentId: p.document.id,
                contributorAudioUrl: `https://${resourceUrl}`,
              },
            })
            return result.error === undefined
          }}
        />
      }
      icon={<FaMicrophone size={24} className={css.wordPanelButton.colpleft} />}
    />
  )
}
