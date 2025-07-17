import React, { ReactNode } from "react"
import {
  AiFillCaretDown,
  AiFillCaretUp,
  AiFillSound,
} from "react-icons/ai/index"
import { IoEllipsisHorizontalCircle } from "react-icons/io5/index"
import {
  MdNotes,
  MdOutlineComment,
  MdRecordVoiceOver,
} from "react-icons/md/index"
import { OnChangeValue } from "react-select"
import { Disclosure, DisclosureContent, useDisclosureState } from "reakit"
import { unstable_Form as Form, unstable_FormInput as FormInput } from "reakit"
import * as Dailp from "src/graphql/dailp"
import { AudioPlayer } from "./components"
import { CommentSection } from "./components/comment-section"
import { CustomCreatable } from "./components/creatable"
import { EditWordAudio } from "./components/edit-word-audio"
import { RecordAudioPanel } from "./components/edit-word-audio/record"
import { useEditWordCheckContext } from "./edit-word-check-context"
import { EditWordFeature } from "./edit-word-feature"
import { formInput } from "./edit-word-feature.css"
import { useForm } from "./edit-word-form-context"
import * as css from "./panel-layout.css"
import { usePreferences } from "./preferences-context"

enum PanelType {
  WordPanel,
  EditWordPanel,
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
export const WordPanel = (p: {
  panel: PanelType
  word: Dailp.FormFieldsFragment
  options: GroupedOption[]
}) => {
  const { setRomanizedSource } = useEditWordCheckContext()
  if (p.word.romanizedSource) {
    setRomanizedSource(p.word.romanizedSource)
  } else {
    setRomanizedSource("")
  }
  // what should be used to render word features? eg, syllabary, commentary, etc.
  const PanelFeatureComponent =
    p.panel === PanelType.EditWordPanel ? EditWordFeature : WordFeature

  // what should be used to render word audio, if present?
  const PanelAudioComponent =
    p.panel === PanelType.EditWordPanel ? EditWordAudio : WordAudio

  // Contains components rendering data of a word's phonetics.
  const phoneticsContent = (
    <>
      {
        <PanelFeatureComponent
          word={p.word}
          feature={"source"}
          label="Syllabary Characters"
        />
      }

      {
        <PanelFeatureComponent
          word={p.word}
          feature={"romanizedSource"}
          label="Simple Phonetics"
        />
      }
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
    </>
  )

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
        <>
          <CollapsiblePanel
            title={"Audio"}
            content={<PanelAudioComponent word={p.word} />}
            icon={
              <AiFillSound size={24} className={css.wordPanelButton.colpleft} />
            }
          />
          <RecordAudioPanel word={p.word} />
        </>
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

      {/* Always show Word Parts panel in edit mode, otherwise only if there are segments */}
      {(p.word.segments.length > 0 || p.panel === PanelType.EditWordPanel) && (
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
  const currentWord = form.values.word as Dailp.FormFieldsFragment
  const currentSegments = currentWord.segments

  const addNewSegment = (e: React.MouseEvent) => {
    e.preventDefault()
    const newSegment = {
      morpheme: "",
      gloss: "",
      role: Dailp.WordSegmentRole.Morpheme,
      previousSeparator: "-",
      matchingTag: null,
      word_id: currentWord.id,
    }

    const updatedSegments = [...currentSegments, newSegment]
    // Add shouldValidate: false to prevent auto-submission
    form.update("word", {
      ...currentWord,
      segments: updatedSegments,
    })
  }

  const deleteSegment = (index: number) => {
    const updatedSegments = currentSegments.filter((_, i) => i !== index)
    form.update("word", {
      ...currentWord,
      segments: updatedSegments,
    })
  }

  return (
    <table className={css.tableContainer}>
      <tbody>
        {currentSegments.map((segment, index) => (
          <tr key={index} style={{ display: "flex" }}>
            <td className={css.editMorphemeCells}>
              {/* This is disabled at the moment to be fully implemented later. */}
              <FormInput
                {...form}
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
            <td style={{ padding: "0 10px" }}>
              <button
                onClick={() => deleteSegment(index)}
                style={{
                  padding: "5px 10px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  background: "#f0f0f0",
                  cursor: "pointer",
                  color: "#d32f2f",
                }}
              >
                ✕
              </button>
            </td>
          </tr>
        ))}
        <tr>
          <td colSpan={3} style={{ textAlign: "center", padding: "10px" }}>
            <button
              onClick={addNewSegment}
              style={{
                padding: "5px 10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                background: "#f0f0f0",
                cursor: "pointer",
              }}
            >
              Add Word Part
            </button>
          </td>
        </tr>
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

type Writeable<T> = { -readonly [P in keyof T]: T[P] }

export const VerticalMorphemicSegmentation = (p: {
  segments: Dailp.FormFieldsFragment["segments"]
  cherokeeRepresentation: Dailp.CherokeeOrthography
}) => {
  if (!p.segments) {
    return null
  }
  if (p.segments) {
    // Combine certain morphemes.
    const combinedSegments: typeof p.segments = p.segments.reduce(
      (result, segment) => {
        if (segment.role === Dailp.WordSegmentRole.Modifier) {
          const lastSegment = result[result.length - 1]!
          result[result.length - 1] = {
            ...lastSegment,
            matchingTag: null,
            morpheme: lastSegment.morpheme + segment.morpheme,
            gloss: `${lastSegment.matchingTag?.title ?? lastSegment.gloss}, ${
              segment.matchingTag?.title ?? segment.gloss
            }`,
          }
        } else {
          result.push(segment)
        }
        return result
      },
      [] as Writeable<typeof p.segments>
    )

    const segmentCount = combinedSegments.length
    const firstRootIndex = combinedSegments.findIndex(
      (segment) => !segment.matchingTag && segment.gloss !== "?"
    )
    return (
      <table className={css.tableContainer}>
        {combinedSegments.map((segment, index) => {
          const isRoot = !segment.matchingTag
          return (
            <tr>
              <td className={css.morphemeCell}>
                {index > 0 && index >= firstRootIndex && !isRoot
                  ? segment.previousSeparator
                  : null}
                {segment.morpheme}
                {index < segmentCount - 1 && index < firstRootIndex && !isRoot
                  ? p.segments[index + 1]!.previousSeparator
                  : null}
              </td>
              <td className={css.glossCell}>
                {segment.matchingTag
                  ? segment.matchingTag.title
                  : segment.gloss.replaceAll(".", " ")}
              </td>
            </tr>
          )
        })}
      </table>
    )
  }
  return null
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
