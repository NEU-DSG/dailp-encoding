import { IconType } from "react-icons"
import * as Dailp from "src/graphql/dailp"
import { CollapsiblePanel } from "src/word-panel"
import * as css from "../../panel-layout.css"
import {
  ContributeAudioComponent,
  ContributeAudioSection,
} from "../contribute-audio-section"

export function ContributeAudioPanel(p: {
  panelTitle: string
  Icon: IconType
  Component: ContributeAudioComponent
  parent: Dailp.FormFieldsFragment | Dailp.DocumentFieldsFragment
}) {
  const [_contributeDocumentAudioResult, contributeDocumentAudio] =
    Dailp.useAttachAudioToDocumentMutation()
  const [_contributeWordAudioResult, contributeWordAudio] =
    Dailp.useAttachAudioToWordMutation()

  return (
    <CollapsiblePanel
      title={p.panelTitle}
      content={
        <ContributeAudioSection
          Component={p.Component}
          processUploadedAudio={async (resourceUrl: string) => {
            const result =
              p.parent.__typename == "AnnotatedForm"
                ? await contributeWordAudio({
                    input: {
                      contributorAudioUrl: resourceUrl,
                      wordId: p.parent.id,
                    },
                  })
                : await contributeDocumentAudio({
                    input: {
                      contributorAudioUrl: resourceUrl,
                      documentId: p.parent.id,
                    },
                  })
            return result.error === undefined
          }}
        />
      }
      icon={<p.Icon size={24} className={css.wordPanelButton.colpleft} />}
    />
  )
}
