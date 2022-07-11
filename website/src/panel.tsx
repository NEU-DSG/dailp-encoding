import React, { ReactNode } from "react"
import { AiFillCaretDown, AiFillCaretUp, AiFillSound } from "react-icons/ai"
import { IoEllipsisHorizontalCircle } from "react-icons/io5"
import { MdClose, MdNotes, MdRecordVoiceOver } from "react-icons/md"
import {
  Disclosure,
  DisclosureContent,
  useDisclosureState,
} from "reakit/Disclosure"
import { unstable_Form as Form } from "reakit/Form"
import { AudioPlayer, IconButton } from "./components"
import EditWordPanel, { EditButton } from "./edit-word-panel"
import { useForm } from "./form-context"
import { FormFieldsFragment } from "./graphql/dailp"
import * as css from "./panel.css"
import { WordPanel } from "./word-panel"

export interface PanelDetails {
  currContents: FormFieldsFragment | null
  setCurrContents: (currContents: FormFieldsFragment | null) => void
}

/** Displays the right-side panel information of the currently selected word. */
export const Panel = (props: {
  segment: FormFieldsFragment | null
  setContent: (content: FormFieldsFragment | null) => void
}) => {
  if (!props.segment) {
    return null
  }

  const { form, isEditing } = useForm()

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

          <EditButton />
        </div>

        <h2 className={css.cherHeader}>{props.segment.source}</h2>
      </header>

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
        <props.panelType word={props.word} features={["source"]} />
      )}

      {props.word.simplePhonetics && (
        <props.panelType word={props.word} features={["simplePhonetics"]} />
      )}

      {props.word.romanizedSource &&
        props.word.romanizedSource !== props.word.simplePhonetics && (
          <props.panelType word={props.word} features={["romanizedSource"]} />
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

      {props.word.englishGloss[0] !== "" && (
        <props.panelType word={props.word} features={["englishGloss"]} />
      )}
    </>
  )

  // Contains a component rendering a word's commentary.
  const commentaryContent = (
    <props.panelType word={props.word} features={["commentary"]} />
  )

  return (
    <>
      {/* Renders audio recording. */}
      <AudioPanel segment={props.word} />

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
      <>
        {p.panelType === WordPanel
          ? p.segments.map((segment, index) => (
              <tr>
                <td className={css.tableCells}>
                  {index > 0 ? "-" : null}
                  {segment.morpheme}
                  {index !== segmentCount - 1 ? segment.nextSeparator : null}
                </td>
                <td className={css.tableCells}>
                  {segment.matchingTag
                    ? segment.matchingTag.title
                    : segment.gloss}
                </td>
              </tr>
            ))
          : p.segments.map((segment, index) => (
              <tr>
                <td className={css.tableCells}>
                  <p.panelType
                    features={["segments", index.toString(), "morpheme"]}
                  />
                </td>
                <td className={css.tableCells}>
                  {segment.matchingTag ? (
                    <p.panelType
                      features={[
                        "segments",
                        index.toString(),
                        "matchingTag",
                        "title",
                      ]}
                    />
                  ) : (
                    <p.panelType
                      features={["segments", index.toString(), "gloss"]}
                    />
                  )}
                </td>
              </tr>
            ))}
      </>
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
          <AiFillCaretDown className={css.wordPanelButton.colpright} />
        ) : (
          <AiFillCaretUp className={css.wordPanelButton.colpright} />
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
