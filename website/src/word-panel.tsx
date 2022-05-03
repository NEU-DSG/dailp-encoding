import React, { ReactNode, useEffect, useState } from "react"
import { AiFillCaretDown, AiFillCaretUp, AiFillSound } from "react-icons/ai"
import { IoEllipsisHorizontalCircle } from "react-icons/io5"
import { MdClose, MdNotes, MdRecordVoiceOver } from "react-icons/md"
import { Button } from "reakit/Button"
import {
  Disclosure,
  DisclosureContent,
  useDisclosureState,
} from "reakit/Disclosure"
import * as Dailp from "src/graphql/dailp"
import { FormAudio } from "./audio-player"
import { MorphemicSegmentation } from "./segment"
import {
  BasicMorphemeSegment,
  TagSet,
  ViewMode,
  morphemeDisplayTag,
} from "./types"
import * as css from "./word-panel.css"

export interface WordPanelDetails {
  currContents: Dailp.FormFieldsFragment | null
  setCurrContents: (currContents: Dailp.FormFieldsFragment | null) => void
}

export const WordPanel = (p: {
  segment: Dailp.FormFieldsFragment | null
  setContent: (content: Dailp.FormFieldsFragment | null) => void
  viewMode: ViewMode
  onOpenDetails: (morpheme: BasicMorphemeSegment) => void
  tagSet: TagSet
}) => {
  if (!p.segment) {
    return <p>No word has been selected</p>
  }

  const translation = p.segment.englishGloss.join(", ")
  let phonetics = null

  if (p.segment.simplePhonetics) {
    phonetics = (
      <>
        {p.segment.simplePhonetics !== p.segment.romanizedSource ? (
          <div>{p.segment.romanizedSource}</div>
        ) : null}
        <div>{p.segment.simplePhonetics}</div>
      </>
    )
  }

  return (
    <div className={css.wordPanelContent}>
      <Button
        className={css.wordPanelButton.basic}
        onClick={() => p.setContent(null)}
        aria-label="Dismiss selected word information"
      >
        <MdClose size={32} />
      </Button>
      <header className={css.wordPanelHeader}>
        <h1 className={css.noSpaceBelow}>Selected Word</h1>
        <h2 className={css.cherHeader}>{p.segment.source}</h2>
      </header>
      <AudioPanel segment={p.segment} />
      {phonetics ? (
        <CollapsiblePanel
          title={"Phonetics"}
          content={phonetics}
          icon={
            <MdRecordVoiceOver
              size={24}
              className={css.wordPanelButton.colpleft}
            />
          }
        />
      ) : null}

      {p.segment.segments?.length ? (
        <CollapsiblePanel
          title={"Word Parts"}
          content={
            <>
              <VerticalMorphemicSegmentation
                segments={p.segment.segments}
                tagSet={p.tagSet}
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
      {p.segment.commentary ? (
        <CollapsiblePanel
          title={"Commentary"}
          content={<>{p.segment.commentary}</>}
          icon={<MdNotes size={24} className={css.wordPanelButton.colpleft} />}
        />
      ) : null}
    </div>
  )
}

export const VerticalMorphemicSegmentation = (p: {
  segments: Dailp.FormFieldsFragment["segments"]
  tagSet: TagSet
}) => {
  if (!p.segments) {
    return null
  }
  if (p.segments) {
    const segmentCount = p.segments.length

    return (
      <table className={css.tableContainer}>
        {p.segments.map((segment, index) => (
          <tr>
            <td className={css.tableCells}>
              {index > 0 ? segment.previousSeparator : null}
              {segment.morpheme}
              {index < segmentCount - 1 ? p.segments[index + 1]!.previousSeparator : null}
            </td>
            <td className={css.tableCells}>
              {segment.matchingTag ? segment.matchingTag.title : segment.gloss}
            </td>
          </tr>
        ))}
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
                <FormAudio
                  endTime={p.segment.audioTrack.endTime}
                  index={p.segment.audioTrack.index}
                  parentTrack=""
                  resourceUrl={p.segment.audioTrack.resourceUrl}
                  startTime={p.segment.audioTrack.startTime}
                  showProgress={true}
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
