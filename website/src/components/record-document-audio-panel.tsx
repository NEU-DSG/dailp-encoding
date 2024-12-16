import cx from "classnames"
import { ReactElement, ReactNode } from "react"
import { IconType } from "react-icons"
import { FaMicrophone } from "react-icons/fa"
import * as Dailp from "src/graphql/dailp"
import { CollapsiblePanel } from "src/word-panel"
import * as css from "../panel-layout.css"
import {
  ContributeAudioComponent,
  ContributeAudioSection,
} from "./contribute-audio-section"
import { RecordAudioContent } from "./edit-word-audio/record"

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
          Component={RecordAudioContent}
          processUploadedAudio={async (resourceUrl: string) => {
            const result = await contributeAudio({
              input: {
                documentId: p.document.id,
                contributorAudioUrl: resourceUrl,
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
