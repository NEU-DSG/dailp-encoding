import React, { ReactNode, useEffect } from "react"
import { AiFillSound } from "react-icons/ai"
import { GrDown, GrUp } from "react-icons/gr"
import { IoEllipsisHorizontalCircle } from "react-icons/io5"
import { MdClose, MdNotes, MdRecordVoiceOver } from "react-icons/md"
import {
  Disclosure,
  DisclosureContent,
  useDisclosureState,
} from "reakit/Disclosure"
import { unstable_Form as Form } from "reakit/Form"
import { useCredentials } from "./auth"
import { AudioPlayer, IconButton } from "./components"
import EditWordPanel, { EditButton } from "./edit-word-panel"
import { content } from "./footer.css"
import { useForm } from "./form-context"
import { FormFieldsFragment } from "./graphql/dailp"
import * as css from "./panel-layout.css"
import ParagraphPanel from "./paragraph-panel"
import { usePreferences } from "./preferences-context"
import { TranslatedParagraph } from "./segment"
import { VerticalMorphemicSegmentation, WordPanel } from "./word-panel"

enum PanelType {
  EditWordPanel,
  WordPanel,
}

export type PanelSegment = FormFieldsFragment | TranslatedParagraph

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
        <AudioPanel segment={p.segment} />
        {isEditing ? (
          <Form {...form}>
            <PanelContent panel={PanelType.EditWordPanel} word={p.segment} />
          </Form>
        ) : (
          <WordPanel word={p.segment} setContent={p.setContent} />
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

/** Dispatches to the corresponding panel type to render a normal word panel or an editable word panel. */
export const PanelContent = (p: {
  panel: PanelType
  word: FormFieldsFragment
}) => {
  const PanelComponent =
    p.panel === PanelType.EditWordPanel ? EditWordPanel : WordPanel

  // Contains components rendering data of a word's phonetics.
  const phoneticsContent = (
    <>
      {p.word.source && (
        <PanelComponent
          word={p.word}
          feature={"source"}
          label="Syllabary Characters"
        />
      )}

      {p.word.romanizedSource && (
        <PanelComponent
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
        <PanelComponent
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
        <>{translation}</>
      )}
    </>
  )

  // Contains a component rendering a word's commentary.
  const commentaryContent = (
    <PanelComponent word={p.word} feature={"commentary"} input="textarea" />
  )

  return (
    <>
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

export const AudioPanel = (p: { segment: FormFieldsFragment }) => {
  return (
    <>
      {p.segment.audioTrack && (
        <CollapsiblePanel
          title={"Audio"}
          content={
            <div>
              {
                <AudioPlayer
                  audioUrl={p.segment.audioTrack.resourceUrl}
                  slices={{
                    start: p.segment.audioTrack.startTime!,
                    end: p.segment.audioTrack.endTime!,
                  }}
                  showProgress
                />
              }
            </div>
          }
          icon={
            <AiFillSound size={24} className={css.wordPanelButton.colpleft} />
          }
        />
      )}
    </>
  )
}
