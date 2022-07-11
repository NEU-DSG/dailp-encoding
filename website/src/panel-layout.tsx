import React, { ReactNode } from "react"
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
import { useForm } from "./form-context"
import { FormFieldsFragment } from "./graphql/dailp"
import * as css from "./panel-layout.css"
import { WordPanel } from "./word-panel"

export interface PanelDetails {
  currContents: FormFieldsFragment | null
  setCurrContents: (currContents: FormFieldsFragment | null) => void
}

/** Displays the right-side panel information of the currently selected word. */
export const PanelLayout = (props: {
  segment: FormFieldsFragment | null
  setContent: (content: FormFieldsFragment | null) => void
}) => {
  if (!props.segment) {
    return null
  }

  const { form, isEditing } = useForm()
  const token = useCredentials()

  return (
    <div className={css.wordPanelContent}>
      <header className={css.wordPanelHeader}>
        <div className={css.headerButtons}>
          <IconButton
            onClick={() => props.setContent(null)}
            aria-label="Dismiss selected word information"
          >
            <MdClose size={32} />
          </IconButton>

          {token && <EditButton />}
        </div>

        <h2 className={css.cherHeader}>{props.segment.source}</h2>
      </header>

      {/* Renders audio recording. */}
      <AudioPanel segment={props.segment} />

      {isEditing ? (
        <Form {...form}>
          <PanelContent panelType={EditWordPanel} word={props.segment} />
        </Form>
      ) : (
        <PanelContent panelType={WordPanel} word={props.segment} />
      )}
    </div>
  )
}

/** Dispatches to the corresponding panel type to render a normal word panel or an editable word panel. */
export const PanelContent = (props: {
  panelType: typeof EditWordPanel | typeof WordPanel
  word: FormFieldsFragment
}) => {
  // Contains components rendering data of a word's phonetics.
  const phoneticsContent = (
    <>
      {props.word.source && (
        <props.panelType
          word={props.word}
          feature={"source"}
          label="Syllabary Characters"
        />
      )}

      {props.word.simplePhonetics && (
        <props.panelType
          word={props.word}
          feature={"simplePhonetics"}
          label="Simple Phonetics"
        />
      )}

      {props.word.romanizedSource &&
        props.word.romanizedSource !== props.word.simplePhonetics && (
          <props.panelType
            word={props.word}
            feature={"romanizedSource"}
            label="Romanized Source"
          />
        )}
    </>
  )

  const translation = (
    <>
      {props.word.englishGloss[0] !== "" && (
        <props.panelType
          word={props.word}
          feature={"englishGloss"}
          label="English Translation"
        />
      )}
    </>
  )

  // Contains components rendering a word's segments and its english translation.
  const wordPartsContent = (
    <>
      <VerticalMorphemicSegmentation
        panelType={props.panelType}
        segments={props.word.segments}
      />

      {props.panelType === WordPanel ? (
        <div style={{ display: "flex" }}>‘{translation}’</div>
      ) : (
        <>{translation}</>
      )}
    </>
  )

  // Contains a component rendering a word's commentary.
  const commentaryContent = (
    <props.panelType
      word={props.word}
      feature={"commentary"}
      input="textarea"
    />
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
      {props.word.segments.length > 0 && (
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
      {props.word.commentary && (
        <CollapsiblePanel
          title={"Commentary"}
          content={commentaryContent}
          icon={<MdNotes size={24} className={css.wordPanelButton.colpleft} />}
        />
      )}
    </>
  )
}

export const VerticalMorphemicSegmentation = (p: {
  panelType: typeof EditWordPanel | typeof WordPanel
  segments: FormFieldsFragment["segments"]
}) => {
  if (!p.segments) {
    return null
  }

  let segmentCount = p.segments.length

  return (
    <table className={css.tableContainer}>
      <tbody>
        {p.segments.map((segment, index) => (
          <tr key={index}>
            <td className={css.tableCells}>
              {index > 0 ? "-" : null}
              {segment.morpheme}
              {index !== segmentCount - 1 ? segment.nextSeparator : null}
            </td>
            <td className={css.tableCells}>
              {segment.matchingTag ? segment.matchingTag.title : segment.gloss}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
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
