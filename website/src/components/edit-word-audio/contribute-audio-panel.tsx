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
  word: Dailp.FormFieldsFragment
}) {
  const [_contributeAudioResult, contributeAudio] =
    Dailp.useAttachAudioToWordMutation()
  return (
    <CollapsiblePanel
      title={p.panelTitle}
      content={
        <ContributeAudioSection
          Component={p.Component}
          processUploadedAudio={async (resourceUrl: string) => {
            const result = await contributeAudio({
              input: { wordId: p.word.id, contributorAudioUrl: resourceUrl },
            })
            return result.error === undefined
          }}
        />
      }
      icon={<p.Icon size={24} className={css.wordPanelButton.colpleft} />}
    />
  )
}
