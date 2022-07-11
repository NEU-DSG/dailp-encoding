import React, { ReactNode } from "react"
import { AiFillCaretDown, AiFillCaretUp, AiFillSound } from "react-icons/ai"
import { IoEllipsisHorizontalCircle } from "react-icons/io5"
import { MdNotes, MdRecordVoiceOver } from "react-icons/md"
import {
  Disclosure,
  DisclosureContent,
  useDisclosureState,
} from "reakit/Disclosure"
import { AudioPlayer } from "src/components"
import * as Dailp from "src/graphql/dailp"
import * as css from "./panel-layout.css"
import { usePreferences } from "./preferences-context"

export const WordPanel = (p: {
  word: Dailp.FormFieldsFragment | null
  setContent?: (content: Dailp.FormFieldsFragment | null) => void
}) => {
  const { cherokeeRepresentation } = usePreferences()
  if (!p.word) {
    return null
  }

  const translation = p.word.englishGloss.join(", ")

  return (
    <>
      {p.word.romanizedSource ? (
        <CollapsiblePanel
          title={"Simple Phonetics"}
          content={<div>{p.word.romanizedSource}</div>}
          icon={
            <MdRecordVoiceOver
              size={24}
              className={css.wordPanelButton.colpleft}
            />
          }
        />
      ) : null}

      {p.word.segments?.length ? (
        <CollapsiblePanel
          title={"Word Parts"}
          content={
            <>
              <VerticalMorphemicSegmentation
                segments={p.word.segments}
                cherokeeRepresentation={cherokeeRepresentation}
              />

              {translation.length ? (
                <div>&lsquo;{translation}&rsquo;</div>
              ) : null}
            </>
          }
          icon={
            <IoEllipsisHorizontalCircle
              size={24}
              className={css.wordPanelButton.colpleft}
            />
          }
        />
      ) : null}
      {p.word.commentary ? (
        <CollapsiblePanel
          title={"Commentary"}
          content={<>{p.word.commentary}</>}
          icon={<MdNotes size={24} className={css.wordPanelButton.colpleft} />}
        />
      ) : null}
    </>
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
const CollapsiblePanel = (p: {
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

const AudioPanel = (p: { segment: Dailp.FormFieldsFragment }) => {
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
