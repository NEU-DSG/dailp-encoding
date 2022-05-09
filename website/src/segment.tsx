import { Tooltip } from "@reach/tooltip"
import "@reach/tooltip/styles.css"
import { Howl } from "howler"
import React, { Dispatch, SetStateAction, useState } from "react"
import { MdCircle, MdInfoOutline } from "react-icons/md"
import * as Dailp from "src/graphql/dailp"
import { DocumentContents } from "src/pages/documents/document.page"
import { FormAudio } from "./audio-player"
import { CleanButton, IconButton } from "./components"
import { romanizationFromSystem } from "./mode"
import * as css from "./segment.css"
import { std } from "./sprinkles.css"
import {
  BasicMorphemeSegment,
  PhoneticRepresentation,
  TagSet,
  ViewMode,
  morphemeDisplayTag,
} from "./types"
import { WordPanelDetails } from "./word-panel"

type TranslatedPage = NonNullable<DocumentContents["translatedPages"]>[0]
type TranslatedParagraph = TranslatedPage["paragraphs"][0]
type Segment = TranslatedParagraph["source"][0]

interface Props {
  segment: Segment
  onOpenDetails: (morpheme: BasicMorphemeSegment) => void
  viewMode: ViewMode
  tagSet: TagSet
  pageImages: readonly string[]
  phoneticRepresentation: PhoneticRepresentation
  wordPanelDetails: WordPanelDetails
}

export const DocumentPage = (
  p: Omit<Props, "segment"> & { segment: TranslatedPage }
) => {
  return (
    <>
      {p.segment.pageNumber !== "1" ? (
        <div
          id={`document-page-${p.segment.pageNumber}`}
          className={css.pageBreak}
          aria-label={`Start of page ${p.segment.pageNumber}`}
        >
          Page {p.segment.pageNumber}
        </div>
      ) : null}
      {p.segment.paragraphs.map((paragraph, i) => (
        <DocumentParagraph key={i} {...p} segment={paragraph} />
      ))}
    </>
  )
}

export const DocumentParagraph = (
  p: Omit<Props, "segment"> & { segment: TranslatedParagraph }
) => {
  const children =
    p.segment.source?.map(function (seg, i) {
      return (
        <Segment
          key={i}
          segment={seg as Segment}
          onOpenDetails={p.onOpenDetails}
          viewMode={p.viewMode}
          tagSet={p.tagSet}
          pageImages={p.pageImages}
          phoneticRepresentation={p.phoneticRepresentation}
          wordPanelDetails={p.wordPanelDetails}
        />
      )
    }) ?? null

  const variant = p.viewMode > ViewMode.Story ? "wordByWord" : "story"
  return (
    <section className={css.documentBlock[variant]}>
      <div className={css.annotationSection[variant]}>{children}</div>
      <p className={css.inlineBlock}>{p.segment.translation ?? null}</p>
      {/*<SegmentAudio/>*/}
    </section>
  )
}

/** Displays one segment of the document, which may be a word, block, or phrase. */
export const Segment = (p: Props & { howl?: Howl }) => {
  const segment = p.segment
  if (segment.__typename === "AnnotatedForm") {
    return <AnnotatedForm {...p} segment={segment} />
  } else {
    return null
  }
}

export const AnnotatedForm = (
  p: Props & { segment: Dailp.FormFieldsFragment }
) => {
  if (!p.segment.source) {
    return null
  }
  const showAnything = p.viewMode > ViewMode.Story
  const isSelected =
    p.wordPanelDetails.currContents?.source === p.segment.source &&
    p.wordPanelDetails.currContents?.index === p.segment.index
  let wordCSS = css.wordGroupSelection.unselected
  if (isSelected) {
    wordCSS = css.wordGroupSelection.selected
    p.wordPanelDetails.setCurrContents(
      p.segment
    ) /* This makes sure the word panel updates for changes to the word panel*/
  }

  const romanization = romanizationFromSystem(
    p.phoneticRepresentation,
    p.segment
  )

  if (showAnything) {
    const showSegments = p.viewMode >= ViewMode.Segmentation
    const translation = p.segment.englishGloss.join(", ")

    return (
      <div className={wordCSS} id={`w${p.segment.index}`}>
        <div className={css.syllabaryLayer} lang="chr">
          {p.segment.source}
          <CleanButton
            title={`View word details for '${p.segment.source}'`}
            onClick={() => p.wordPanelDetails.setCurrContents(p.segment)}
          >
            {isSelected ? (
              <MdCircle size={20} className={css.linkSvg} />
            ) : (
              <MdInfoOutline size={20} className={css.linkSvg} />
            )}
          </CleanButton>
        </div>
        {romanization ? (
          <>
            <div>{romanization}</div>
            <div>
              {p.segment.phonemic && p.viewMode >= ViewMode.Pronunciation && (
                <div />
              )}
            </div>
          </>
        ) : (
          <>
            <FillerLine />
            <FillerLine />
          </>
        )}
        {showSegments ? (
          <MorphemicSegmentation
            segments={p.segment.segments}
            onOpenDetails={p.onOpenDetails}
            level={p.viewMode}
            tagSet={p.tagSet}
          />
        ) : null}
        {translation.length ? (
          <div>&lsquo;{translation}&rsquo;</div>
        ) : (
          <FillerLine />
        )}
      </div>
    )
  } else {
    return (
      <>
        <span
          className={css.plainSyllabary}
          id={`w${p.segment.index}`}
          lang="chr"
        >
          {p.segment.source}
        </span>{" "}
      </>
    )
  }
}

const WordCommentaryInfo = (p: { commentary: string }) => (
  <WithTooltip hint={p.commentary} aria-label="Commentary on this word">
    <span className={css.infoIcon}>
      <MdInfoOutline size={20} className={css.linkSvg} />
    </span>
  </WithTooltip>
)

const WithTooltip = (p: {
  hint: string
  children: any
  "aria-label"?: string
}) => (
  <Tooltip
    className={std.tooltip}
    label={p.hint || ""}
    aria-label={p["aria-label"]}
  >
    {p.children}
  </Tooltip>
)

const FillerLine = () => (
  <div className={css.lineBox}>
    <hr className={css.fillerLine} />
  </div>
)

/**
 * Displays the break-down of a word into its units of meaning and the English
 * glosses for each morpheme.
 */
export const MorphemicSegmentation = (p: {
  segments: Dailp.FormFieldsFragment["segments"]
  tagSet: TagSet
  onOpenDetails: Props["onOpenDetails"]
  level: ViewMode
}) => {
  // If there is no segmentation, return a hard break for the
  // morphemic segmentation and morpheme gloss layers.
  if (!p.segments?.length) {
    return (
      <>
        <FillerLine />
        <FillerLine />
      </>
    )
  }

  // Adapt the segment shape to the chosen experience level.
  let segmentation = ""
  for (const seg of p.segments) {
    // TODO Use more robust check than looking for ":"
    if (
      seg.previousSeparator &&
      segmentation.length > 0 &&
      seg.previousSeparator !== ":"
    ) {
      segmentation += seg.previousSeparator
    }
    segmentation += seg.morpheme
  }

  return (
    <>
      <i>{segmentation}</i>
      <div>
        {p.segments.map(function (segment, i) {
          return (
            <React.Fragment key={i}>
              {i > 0 && segment.previousSeparator}
              <MorphemeSegment
                segment={segment}
                tagSet={p.tagSet}
                onOpenDetails={p.onOpenDetails}
              />
            </React.Fragment>
          )
        })}
      </div>
    </>
  )
}

/** One morpheme that can be clicked to see further details. */
const MorphemeSegment = (p: {
  segment: BasicMorphemeSegment
  tagSet: TagSet
  onOpenDetails: Props["onOpenDetails"]
}) => {
  const matchingTag = p.segment.matchingTag
  const gloss = matchingTag?.tag || p.segment.gloss
  // Display functional tags in small-caps, per interlinear typesetting practice.

  if (matchingTag && matchingTag.title) {
    return (
      <WithTooltip hint={matchingTag.title}>
        <button
          className={css.morphemeButton.functional}
          onClick={() => p.onOpenDetails(p.segment)}
        >
          {gloss}
        </button>
      </WithTooltip>
    )
  } else if (gloss === "?") {
    return (
      <WithTooltip hint="Unanalyzed or unfamiliar segment">
        <button
          className={css.morphemeButton.lexical}
          onClick={() => p.onOpenDetails(p.segment)}
        >
          {gloss}
        </button>
      </WithTooltip>
    )
  } else {
    return (
      <button
        className={css.morphemeButton.lexical}
        onClick={() => p.onOpenDetails(p.segment)}
      >
        {gloss}
      </button>
    )
  }
}
