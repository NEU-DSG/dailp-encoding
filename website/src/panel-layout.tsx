import { groupBy } from "lodash"
import React, { ReactNode } from "react"
import { useState } from "react"
import { AiFillSound } from "react-icons/ai/index"
import { GrDown, GrUp } from "react-icons/gr/index"
import { IoEllipsisHorizontalCircle } from "react-icons/io5/index"
import {
  MdClose,
  MdNotes,
  MdOutlineComment,
  MdRecordVoiceOver,
} from "react-icons/md/index"
import { OnChangeValue } from "react-select"
import { Disclosure, DisclosureContent, useDisclosureState } from "reakit"
import { unstable_Form as Form, unstable_FormInput as FormInput } from "reakit"
import * as Dailp from "src/graphql/dailp"
import { useCognitoUserGroups, useCredentials } from "./auth"
import CommentPanel from "./comment-panel"
import { AudioPlayer, Button, IconButton } from "./components"
import { CommentSection } from "./components/comment-section"
import { CustomCreatable } from "./components/creatable"
import { EditWordAudio } from "./components/edit-word-audio"
import { RecordAudioPanel } from "./components/edit-word-audio/record"
import { UploadAudioPanel } from "./components/edit-word-audio/upload"
import { SubtleButton } from "./components/subtle-button"
import { EditButton, EditWordFeature } from "./edit-word-feature"
import { formInput } from "./edit-word-feature.css"
import { useForm } from "./edit-word-form-context"
import { content } from "./footer.css"
import * as css from "./panel-layout.css"
import ParagraphPanel from "./paragraph-panel"
import { usePreferences } from "./preferences-context"
import { TranslatedParagraph } from "./segment"
import { VerticalMorphemicSegmentation } from "./word-panel"

enum PanelType {
  WordPanel,
  EditWordPanel,
}

export type PanelSegment = Dailp.FormFieldsFragment | TranslatedParagraph

export interface PanelDetails {
  currContents: PanelSegment | null
  setCurrContents: (currContents: PanelSegment | null) => void
}

// Displays the right-side panel information of the currently selected segment.
export const PanelLayout = (p: {
  segment: PanelSegment | null
  setContent: (content: PanelSegment | null) => void
}) => {
  if (!p.segment) {
    return null
  }

  const { form, isEditing } = useForm()

  const token = useCredentials()
  const userGroups = useCognitoUserGroups()

  // Get all global glosses / matching tags to display.
  const { cherokeeRepresentation } = usePreferences()
  const [{ data }] = Dailp.useGlossaryQuery({
    variables: { system: cherokeeRepresentation },
  })

  const [isCommenting, setIsCommenting] = useState(false)

  if (!data) {
    return <p>Loading...</p>
  }

  // Get all the tags except for those which are empty/undefined.
  const allTags = data.allTags.filter((tag) => tag.tag !== "")
  const groupedTags = groupBy(allTags, (t) => t.morphemeType)

  // Creates a selectable option out of each functional tag, and groups them together by morpheme type.
  const options: GroupedOption[] = Object.entries(groupedTags).map(
    ([group, tags]) => {
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
    }
  )

  let panel = null

  // Display the paragraph panel if the segment type is a word (AnnotatedForm).
  if (isCommenting === true) {
    if (p.segment != null) {
      panel = (
        <CommentPanel segment={p.segment} setIsCommenting={setIsCommenting} />
      )
    }
  } else if (p.segment.__typename === "AnnotatedForm") {
    panel = (
      <>
        {/* If the user belongs to any groups, then display an edit button on the word
        panel along with its corresponding formatted header. Otherwise, display
        the normal word panel. */}
        {userGroups.length > 0 ? (
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
            <PanelContent
              panel={PanelType.EditWordPanel}
              word={p.segment}
              options={options}
            />
          </Form>
        ) : (
          <PanelContent
            panel={PanelType.WordPanel}
            word={p.segment}
            // options are only required for editing
            // FIXME: why is this a prop
            options={[]}
          />
        )}
      </>
    )
  } else if (p.segment.__typename === "DocumentParagraph") {
    // Display the paragraph panel if the segment type is a paragraph.
    panel = <ParagraphPanel segment={p.segment} setContent={p.setContent} />
  }

  return (
    <div className={css.wordPanelContent}>
      <>{panel}</>
      {token && // only show the option to leave a comment if the user is signed in
        (isCommenting ? (
          <SubtleButton
            type="button"
            onClick={() => setIsCommenting(false)}
            className={css.buttonSpacing}
          >
            Discard
          </SubtleButton>
        ) : (
          <Button type="button" onClick={() => setIsCommenting(true)}>
            Comment
          </Button>
        ))}
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

// A label associated with a list of options.
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
  const userGroups = useCognitoUserGroups()

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
          label="Simple Phonetics"
        />
      )}
    </>
  )

  const translation = (
    <>
      {/* If the english gloss string is not empty, then display it. */}
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
        // should this be a call to the parameterized component as well?
        <>{translation}</>
      )} */}
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

  const discussionContent = <CommentSection parent={p.word} />

  return (
    <>
      {(p.word.editedAudio.length || p.panel === PanelType.EditWordPanel) && (
        <CollapsiblePanel
          title={
            p.panel === PanelType.EditWordPanel ? "Contributed Audio" : "Audio"
          }
          content={<PanelAudioComponent word={p.word} />}
          icon={
            <AiFillSound size={24} className={css.wordPanelButton.colpleft} />
          }
        />
      )}
      {p.panel === PanelType.EditWordPanel &&
        userGroups.includes(Dailp.UserGroup.Contributors) && (
          <RecordAudioPanel word={p.word} />
        )}
      {p.panel === PanelType.EditWordPanel &&
        userGroups.includes(Dailp.UserGroup.Editors) && (
          <UploadAudioPanel word={p.word} />
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
          title={"Linguistic commentary"}
          content={commentaryContent}
          icon={<MdNotes size={24} className={css.wordPanelButton.colpleft} />}
        />
      )}

      <CollapsiblePanel
        title={"Discussion"}
        content={discussionContent}
        icon={
          <MdOutlineComment
            size={24}
            className={css.wordPanelButton.colpleft}
          />
        }
      />
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
