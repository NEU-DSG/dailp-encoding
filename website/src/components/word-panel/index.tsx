import { groupBy } from "lodash"
import React, { ReactNode, useState } from "react"
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "react-beautiful-dnd"
import {
  AiFillCaretDown,
  AiFillCaretUp,
  AiFillSound,
} from "react-icons/ai/index"
import { IoBookmarks, IoEllipsisHorizontalCircle } from "react-icons/io5/index"
import {
  MdDragIndicator,
  MdNotes,
  MdOutlineComment,
  MdRecordVoiceOver,
} from "react-icons/md/index"
import { OnChangeValue } from "react-select"
import { Disclosure, DisclosureContent, useDisclosureState } from "reakit"
import { unstable_Form as Form, unstable_FormInput as FormInput } from "reakit"
import { useMutation, useQuery } from "urql"
import { useEditWordCheckContext } from "src/edit-word-check-context"
import { EditWordFeature } from "src/edit-word-feature"
import { formInput } from "src/edit-word-feature.css"
import { useForm } from "src/edit-word-form-context"
import * as css from "src/features/documents/components/panel-layout/panel-layout.css"
import * as Dailp from "src/graphql/dailp"
import { usePreferences } from "src/preferences-context"
import { CommentSection } from "../comment-section"
import { CustomCreatable } from "../creatable"
import { EditWordAudio } from "../edit-word-audio"
import { RecordAudioPanel } from "../edit-word-audio/record"
import { AudioPlayer } from "../index"

// Extracts the inner contents of the first pair of parentheses from a string.
function extractParenthesesContent(str: string): string | null {
  const match = str.match(/\(([^)]+)\)/)
  return match?.[1] ?? null
}

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
    </>
  )

  const commentaryContent = (
    <PanelFeatureComponent
      word={p.word}
      feature={"commentary"}
      input="textarea"
    />
  )
  const englishGlossContent = (
    <>
      {p.panel === PanelType.WordPanel ? (
        <div style={{ display: "flex" }}>‘{p.word.englishGloss}’</div>
      ) : (
        <EditEnglishGloss />
      )}

      {/* Since editing translations is not yet supported, just display the translation for now. */}
    </>
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
      {(p.word.englishGloss.length > 0 ||
        p.panel === PanelType.EditWordPanel) && (
        <CollapsiblePanel
          title={"English Gloss"}
          content={englishGlossContent}
          icon={
            <IoBookmarks size={24} className={css.wordPanelButton.colpleft} />
          }
        />
      )}

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

  const onDragEnd = (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) {
      return
    }

    const items = Array.from(currentSegments)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem!)

    form.update("word", {
      ...currentWord,
      segments: items,
    })
  }

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
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <table
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={css.tableContainer}
          >
            <tbody>
              {currentSegments.map((segment, index) => (
                <Draggable
                  key={index}
                  draggableId={index.toString()}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <tr
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      key={index}
                      style={{
                        display: "flex",
                        ...provided.draggableProps.style,
                      }}
                    >
                      <MdDragIndicator fontSize={"1.5rem"} />
                      <td className={css.editMorphemeCells}>
                        {/* This is disabled at the moment to be fully implemented later. */}
                        <FormInput
                          {...form}
                          className={formInput}
                          name={[
                            "word",
                            "segments",
                            index.toString(),
                            "morpheme",
                          ]}
                        />
                      </td>
                      <td className={css.editGlossCells}>
                        {/* Displays global glosses and allows user to create custom glosses on keyboard input. */}
                        <EditWordPartGloss
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
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              <tr>
                <td
                  colSpan={3}
                  style={{ textAlign: "center", padding: "10px" }}
                >
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
                    Add Segment
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </Droppable>
    </DragDropContext>
  )
}

// Component that allows editing of a morpheme's gloss. Users can enter a custom gloss or select from global glosses / functional tags.
const EditWordPartGloss = (props: {
  morpheme: Dailp.FormFieldsFragment["segments"][0]
  index: number
  options: GroupedOption[]
}) => {
  const preferences = usePreferences()
  const { form } = useForm()
  const [, insertCustomMorphemeTag] = useMutation(
    Dailp.InsertCustomMorphemeTagDocument
  )
  const [{ data: allTagsData }, executeQuery] = useQuery({
    query: Dailp.GlossaryDocument,
    variables: { system: preferences.cherokeeRepresentation },
  })

  let allNewTags = allTagsData?.allTags.filter(
    (tag: Dailp.MorphemeTag) => tag.tag !== ""
  )
  const groupedTags = groupBy(allNewTags, (t) => t.morphemeType)

  // Creates a selectable option out of each functional tag, and groups them together by morpheme type.
  const allNewOptions: GroupedOption[] = Object.entries(groupedTags).map(
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

  // Handles gloss selection and creation of new glosses.
  const handleNewTag = async (
    newValue: OnChangeValue<{ value: string; label: string }, false>
  ) => {
    // if newvalue value == newvalue label, its a new gloss
    if (newValue) {
      const parenthesesContent = extractParenthesesContent(newValue.label)
      const title = newValue.label.substring(0, newValue.label.indexOf("("))
      if (parenthesesContent) {
        //db update
        // Insert the new tag and refresh the query
        await insertCustomMorphemeTag({
          tag: parenthesesContent,
          title: title,
          system: preferences.cherokeeRepresentation,
        })
        // Refresh the query to get the new tag
        await executeQuery({ requestPolicy: "network-only" })
      } else {
        //just do frontend update
      }

      let matchingTag =
        newValue.value === newValue.label
          ? parenthesesContent
            ? {
                tag: parenthesesContent,
                title: newValue.label,
              }
            : null
          : {
              tag: newValue.value,
              title: newValue.label,
            }

      const newMorpheme: Dailp.FormFieldsFragment["segments"][0] = {
        ...props.morpheme,
        gloss: parenthesesContent ? parenthesesContent : newValue.value,
        matchingTag: matchingTag,
      }
      form.update(["word", "segments", props.index], newMorpheme)
    }
  }

  return (
    <CustomCreatable
      onChange={handleNewTag}
      options={allNewOptions ?? props.options}
      defaultValue={{
        value: props.morpheme.gloss,
        label: props.morpheme.matchingTag?.title ?? props.morpheme.gloss,
      }}
      // Show a "create new" option at the end of the menu
      createOptionPosition="last"
      // Label for the create option row
      formatCreateLabel={(inputValue: string) => `Create "${inputValue}"`}
      // Only allow non-empty unique values
      isValidNewOption={(inputValue: string, _value: any, options: any[]) =>
        inputValue.trim().length > 0 &&
        !options.some((o: any) => (o?.value ?? "") === inputValue)
      }
    />
  )
}

// Component that allows editing of a morpheme's gloss. Users can enter a custom gloss or select from global glosses / functional tags.
const EditEnglishGloss = () => {
  return <EditWordFeature feature={"englishGloss"} label="English Gloss" />
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
