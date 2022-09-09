import { groupBy } from "lodash"
import React, { ReactNode } from "react"
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
import { unstable_Form as Form } from "reakit/Form"
import { unstable_FormInput as FormInput } from "reakit/Form"
import * as Dailp from "src/graphql/dailp"
import { useCredentials } from "./auth"
import { AudioPlayer, IconButton } from "./components"
import { CustomCreatable } from "./components/creatable"
import EditWordPanel, { EditButton } from "./edit-word-panel"
import { formInput } from "./edit-word-panel.css"
import { useForm } from "./form-context"
import * as Dailp from "./graphql/dailp"
import * as css from "./panel-layout.css"
import { usePreferences } from "./preferences-context"
import { VerticalMorphemicSegmentation, WordPanel } from "./word-panel"

enum PanelType {
  WordPanel,
  EditWordPanel,
}

export interface PanelDetails {
  currContents: Dailp.FormFieldsFragment | null
  setCurrContents: (currContents: Dailp.FormFieldsFragment | null) => void
}

/** Displays the right-side panel information of the currently selected word. */
export const PanelLayout = (p: {
  segment: Dailp.FormFieldsFragment | null
  setContent: (content: Dailp.FormFieldsFragment | null) => void
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
  const groupedOptions = Object.entries(groupedTags).map(([group, tags]) => {
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

  return (
    <div className={css.wordPanelContent}>
      {/* If the user is logged in, then display an edit button on the word panel along with its corresponding formatted header. Otherwise, display the normal word panel.*/}
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
            <h1 className={css.noSpaceBelow}>Selected Word</h1>
            <h2 className={css.cherHeader}>{p.segment.source}</h2>
          </header>
        </>
      )}

      {/* Renders audio recording. */}
      <AudioPanel segment={p.segment} />

      {isEditing ? (
        <Form {...form}>
          <PanelContent
            panel={PanelType.EditWordPanel}
            word={p.segment}
            groupedOptions={groupedOptions}
          />
        </Form>
      ) : (
        <WordPanel word={p.segment} setContent={p.setContent} />
      )}
    </div>
  )
}

/** Dispatches to the corresponding panel type to render a normal word panel or an editable word panel. */
export const PanelContent = (p: {
  panel: PanelType
  word: FormFieldsFragment
  groupedOptions: {
    label: string
    options: {
      value: string
      label: string
    }[]
  }[]
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
        <EditSegmentation
          segments={p.word.segments}
          groupedOptions={p.groupedOptions}
        />
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
  segments: FormFieldsFragment["segments"]
  groupedOptions: {
    label: string
    options: {
      value: string
      label: string
    }[]
  }[]
}) => {
  const { form } = useForm()

  // Create a new list of morphemes for this word. If the index matches the updated morpheme's index, then push in the new morpheme. Else, push in the unchanged morpheme.
  const updateMorpheme = (
    newMorpheme: FormFieldsFragment["segments"][0],
    index: number
  ) => {
    const updatedMorphemes: Dailp.FormFieldsFragment["segments"] =
      p.segments.map((segment, idx) => {
        if (idx === index) {
          return newMorpheme
        }
        return segment
      })

    form.update(["word", "segments"], updatedMorphemes)
  }

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
                updateMorpheme={updateMorpheme}
                groupedOptions={p.groupedOptions}
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
  morpheme: FormFieldsFragment["segments"][0]
  index: number
  updateMorpheme: (
    morpheme: FormFieldsFragment["segments"][0],
    index: number
  ) => void
  groupedOptions: {
    label: string
    options: {
      value: string
      label: string
    }[]
  }[]
}) => {
  // Handles gloss selection, and creation of new glosses.
  const handleChange = (
    newValue: OnChangeValue<{ value: string; label: string }, false>
  ) => {
    if (newValue?.value) {
      // Updates current list of morphemes to include one with a matching tag, or add a morpheme with a custom gloss.
      props.updateMorpheme(
        {
          ...props.morpheme,
          gloss: newValue.value,
        },
        props.index
      )
    }
  }

  return (
    <CustomCreatable
      onChange={handleChange}
      options={props.groupedOptions}
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
