import React, { ReactNode } from "react"
import { AiFillSound } from "react-icons/ai/index"
import { GrDown, GrUp } from "react-icons/gr/index"
import { IoEllipsisHorizontalCircle } from "react-icons/io5/index"
import { MdClose, MdNotes, MdRecordVoiceOver } from "react-icons/md/index"
import { Disclosure, DisclosureContent, useDisclosureState } from "reakit"
import { unstable_Form as Form } from "reakit"
import { useCredentials } from "./auth"
import { AudioPlayer, IconButton } from "./components"
import { useForm } from "./edit-word-form-context"
import { EditWordAudio } from "./components/edit-word-audio"
import { EditButton, EditWordFeature } from "./edit-word-feature"
import { content } from "./footer.css"
import * as Dailp from "./graphql/dailp"
import * as css from "./panel-layout.css"
import ParagraphPanel from "./paragraph-panel"
import { usePreferences } from "./preferences-context"
import { TranslatedParagraph } from "./segment"
import { VerticalMorphemicSegmentation } from "./word-panel"

enum PanelType {
  EditWordPanel,
  WordPanel,
}

export type PanelSegment = Dailp.FormFieldsFragment | TranslatedParagraph

export interface PanelDetails {
  currContents: PanelSegment | null
  setCurrContents: (currContents: PanelSegment | null) => void
}

/** Displays the right-side panel information of the currently selected word. */
export const PanelLayout = (p: {
  segment: PanelSegment | null
  setContent: (content: PanelSegment | null) => void
}) => {
  if (!p.segment) {
    return null
  }

  const { form, isEditing } = useForm()
  const token = useCredentials()

  let panel = null

  if (p.segment.__typename === "AnnotatedForm") {
    panel = (
      <>
        {/* If the user is logged in, then display an edit button on the word
        panel along with its corresponding formatted header. Otherwise, display
        the normal word panel. */}
        {token ? (
          <header className={css.wordPanelHeader}>
            <div className={css.headerButtons}>
              {!isEditing && (
                <IconButton
                  onClick={() => p.setContent(null)}
                  aria-label="Dismiss selected word information"
                >
                  <MdClose size={32} />
                </IconButton>
              )}
              <EditButton />
            </div>
            <h2 className={css.editCherHeader}>{p.segment.source}</h2>
          </header>
        ) : (
          <>
            <IconButton
              className={css.wordPanelButton.basic}
              onClick={() => p.setContent(null)}
              aria-label="Dismiss selected word information"
            >
              <MdClose size={32} />
            </IconButton>
            <header className={css.wordPanelHeader}>
              <h1 className={css.noSpaceBelow}>{`Word ${p.segment.index}`}</h1>
              <h2 className={css.cherHeader}>{p.segment.source}</h2>
            </header>
          </>
        )}
        {/* Renders audio recording. */}
        {isEditing ? (
          <Form {...form}>
            <PanelContent panel={PanelType.EditWordPanel} word={p.segment} />
          </Form>
        ) : (
          <PanelContent panel={PanelType.WordPanel} word={p.segment} />
        )}
      </>
    )
  } else if (p.segment.__typename === "DocumentParagraph") {
    panel = <ParagraphPanel segment={p.segment} setContent={p.setContent} />
  }

  return (
    <div className={css.wordPanelContent}>
      <>{panel}</>
    </div>
  )
}

function WordFeature(p: {
  word: Dailp.FormFieldsFragment
  feature: keyof Dailp.FormFieldsFragment
  label?: string
}) {
  return <div>{p.word[p.feature]}</div>
}

/** Dispatches to the corresponding panel type to render a normal word panel or an editable word panel. */
export const PanelContent = (p: {
  panel: PanelType
  word: Dailp.FormFieldsFragment
}) => {
  // what should be used to render word features? eg, syllabary, commentary, etc.
  const PanelFeatureComponent =
    p.panel === PanelType.EditWordPanel ? EditWordFeature : WordFeature

  // what should be used to render word audio, if present?
  const PanelAudioComponent =
    p.panel === PanelType.EditWordPanel ? EditWordAudio : WordAudio

  // Contains components rendering data of a word's phonetics.
  const phoneticsContent = (
    <>
      {p.word.source && (
        <PanelFeatureComponent
          word={p.word}
          feature={"source"}
          label="Syllabary Characters"
        />
      )}

      {p.word.romanizedSource && (
        <PanelFeatureComponent
          word={p.word}
          feature={"romanizedSource"}
          label="Romanized Source"
        />
      )}
    </>
  )

  const translation = (
    <>
      {p.word.englishGloss[0] !== "" && (
        <PanelFeatureComponent
          word={p.word}
          feature={"englishGloss"}
          label="English Translation"
        />
      )}
    </>
  )

  const { cherokeeRepresentation } = usePreferences()

  // Contains components rendering a word's segments and its english translation.
  const wordPartsContent = (
    <>
      <VerticalMorphemicSegmentation
        cherokeeRepresentation={cherokeeRepresentation}
        segments={p.word.segments}
      />

      {p.panel === PanelType.WordPanel ? (
        <div style={{ display: "flex" }}>‘{translation}’</div>
      ) : (
        // should this be a call to the parameterized component as well?
        <>{translation}</>
      )}
    </>
  )

  // Contains a component rendering a word's commentary.
  const commentaryContent = (
    <PanelFeatureComponent
      word={p.word}
      feature={"commentary"}
      input="textarea"
    />
  )

  return (
    <>
      {(p.word.editedAudio.length || p.panel === PanelType.EditWordPanel) && (
        <CollapsiblePanel
          title={"Audio"}
          content={<PanelAudioComponent word={p.word} />}
          icon={
            <AiFillSound size={24} className={css.wordPanelButton.colpleft} />
          }
        />
      )}
      <CollapsiblePanel
        title={"Phonetics"}
        content={phoneticsContent}
        icon={
          <MdRecordVoiceOver
            size={24}
            className={css.wordPanelButton.colpleft}
          />
        }
      />

      {/* If there are no segments, does not display Word Parts panel */}
      {p.word.segments.length > 0 && (
        <CollapsiblePanel
          title={"Word Parts"}
          content={wordPartsContent}
          icon={
            <IoEllipsisHorizontalCircle
              size={24}
              className={css.wordPanelButton.colpleft}
            />
          }
        />
      )}

      {/* If there is no commentary, does not display Commentary panel */}
      {p.word.commentary && p.word.commentary.length > 0 && (
        <CollapsiblePanel
          title={"Commentary"}
          content={commentaryContent}
          icon={<MdNotes size={24} className={css.wordPanelButton.colpleft} />}
        />
      )}
    </>
  )
}

export const CollapsiblePanel = (p: {
  title: string
  content: ReactNode
  icon: ReactNode // Note : this is supposed to be an IconType
}) => {
  const disclosure = useDisclosureState({ visible: true })

  return (
    <div className={css.collPanel}>
      <Disclosure
        {...disclosure}
        className={css.collPanelButton}
        aria-label={p.title}
      >
        {p.icon} {p.title}
        {disclosure.visible ? (
          <GrDown className={css.wordPanelButton.colpright} />
        ) : (
          <GrUp className={css.wordPanelButton.colpright} />
        )}
      </Disclosure>
      <DisclosureContent {...disclosure} className={css.collPanelContent}>
        {p.content}
      </DisclosureContent>
    </div>
  )
}

export const WordAudio = (p: { word: Dailp.FormFieldsFragment }) => {
  if (p.word.editedAudio.length === 0) return null
  return (
    <>
      {p.word.editedAudio.map((audioTrack) => (
        <AudioPlayer
          audioUrl={audioTrack.resourceUrl}
          slices={
            audioTrack.startTime !== undefined &&
            audioTrack.startTime !== null &&
            audioTrack.endTime !== undefined &&
            audioTrack.endTime !== null
              ? {
                  start: audioTrack.startTime,
                  end: audioTrack.endTime,
                }
              : undefined
          }
          showProgress
        />
      ))}
    </>
  )
}
