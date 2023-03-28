import { groupBy } from "lodash"
import React, { ReactNode, useEffect } from "react"
import { AiFillSound } from "react-icons/ai"
import { GrDown, GrUp } from "react-icons/gr"
import { IoEllipsisHorizontalCircle } from "react-icons/io5"
import { MdClose, MdNotes, MdRecordVoiceOver } from "react-icons/md"
import { OnChangeValue } from "react-select"
import {
  Disclosure,
  DisclosureContent,
  useDisclosureState,
} from "reakit/Disclosure"
import {
  unstable_Form as Form,
  unstable_FormInput as FormInput,
} from "reakit/Form"
import { useCredentials } from "./auth"
import { AudioPlayer, IconButton } from "./components"
import { CustomCreatable } from "./components/creatable"
import EditWordPanel, { EditButton } from "./edit-word-panel"
import { formInput } from "./edit-word-panel.css"
import { content } from "./footer.css"
import { useForm } from "./form-context"
import * as css from "./panel-layout.css"
import ParagraphPanel from "./paragraph-panel"
import { usePreferences } from "./preferences-context"
import { TranslatedParagraph } from "./segment"
import { VerticalMorphemicSegmentation, WordPanel } from "./word-panel"

enum PanelType {
  WordPanel,
  EditWordPanel,
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

  // Get all global glosses / matching tags to display.
  const { cherokeeRepresentation } = usePreferences()
  const [{ data }] = Dailp.useGlossaryQuery({
    variables: { system: cherokeeRepresentation },
  })

  if (!data) {
    return <p>Loading...</p>
  }

  // Get all the tags except for those which are empty/undefined.
  const allTags = data.allTags.filter((tag) => tag.tag !== "")
  const groupedTags = groupBy(allTags, (t) => t.morphemeType)

  // Creates a selectable option out of each functional tag, and groups them together by morpheme type.
  const options = Object.entries(groupedTags).map(([group, tags]) => {
    return {
      label: group,
      options: tags.map((tag) => {
        return {
          // Value is a custom type to track data of a morpheme's gloss in its string form and its matching tag, if there is one.
          value: tag.tag,
          label: tag.title,
        }
      }),
    }
  })

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

type GroupedOption = {
  label: string
  options: {
    value: string
    label: string
  }[]
}

/** Dispatches to the corresponding panel type to render a normal word panel or an editable word panel. */
export const PanelContent = (p: {
  panel: PanelType
  word: Dailp.FormFieldsFragment
  options: GroupedOption[]
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
          label="Simple Phonetics"
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
      {p.panel === PanelType.WordPanel ? (
        <VerticalMorphemicSegmentation
          cherokeeRepresentation={cherokeeRepresentation}
          segments={p.word.segments}
        />
      ) : (
        <EditSegmentation segments={p.word.segments} options={p.options} />
      )}

      {/* Since editing translations is not yet supported, just display the translation for now. */}
      <div style={{ display: "flex" }}>‘{p.word.englishGloss}’</div>

      {/* {p.panel === PanelType.WordPanel ? (
        <div style={{ display: "flex" }}>‘{translation}’</div>
      ) : (
        <>{translation}</>
      )} */}
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

// An editable view of a word's parts / segments.
const EditSegmentation = (p: {
  segments: Dailp.FormFieldsFragment["segments"]
  options: GroupedOption[]
}) => {
  const { form } = useForm()

  return (
    <table className={css.tableContainer}>
      <tbody>
        {p.segments.map((segment, index) => (
          <tr style={{ display: "flex" }}>
            <td className={css.editMorphemeCells}>
              {/* This is disabled at the moment to be fully implemented later. */}
              <FormInput
                {...form}
                disabled
                className={formInput}
                name={["word", "segments", index.toString(), "morpheme"]}
              />
            </td>
            <td className={css.editGlossCells}>
              {/* Displays global glosses and allows user to create custom glosses on keyboard input. */}
              <EditGloss
                // TODO: this key will need to be changed later since a morpheme can be changed
                key={segment.morpheme}
                morpheme={segment}
                index={index}
                options={p.options}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// Component that allows editing of a morpheme's gloss. Users can enter a custom gloss or select from global glosses / functional tags.
const EditGloss = (props: {
  morpheme: Dailp.FormFieldsFragment["segments"][0]
  index: number
  options: GroupedOption[]
}) => {
  const { form } = useForm()

  // Handles gloss selection and creation of new glosses.
  const handleChange = (
    newValue: OnChangeValue<{ value: string; label: string }, false>
  ) => {
    if (newValue?.value) {
      const newMorpheme: Dailp.FormFieldsFragment["segments"][0] = {
        ...props.morpheme,
        gloss: newValue.value,
      }

      // Updates current list of morphemes to include one with a matching tag,
      // or one with a custom gloss.
      form.update(["word", "segments", props.index], newMorpheme)
    }
  }

  return (
    <CustomCreatable
      onChange={handleChange}
      options={props.options}
      defaultValue={{
        value: props.morpheme.gloss,
        label: props.morpheme.matchingTag?.title ?? props.morpheme.gloss,
      }}
    />
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

export const AudioPanel = (p: { segment: Dailp.FormFieldsFragment }) => {
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
