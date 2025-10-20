import { Tooltip } from "@reach/tooltip"
import "@reach/tooltip/styles.css"
import cx from "classnames"
import React from "react"
import { MdCircle, MdInfoOutline } from "react-icons/md/index"
import { useForm } from "src/features/editor/context/edit-word-form-context"
import * as Dailp from "src/graphql/dailp"
import { DocumentContents } from "src/pages/documents/document.page"
import { std } from "src/style/utils.css"
import { PanelDetails } from "src/ui/organisms/panel-layout/panel-layout"
import { CleanButton } from "./components"
import { Environment, deploymentEnvironment } from "./env"
import * as css from "./segment.css"
import { BasicMorphemeSegment, LevelOfDetail } from "./types"

type TranslatedPage = NonNullable<DocumentContents["translatedPages"]>[0]
export type TranslatedParagraph = TranslatedPage["paragraphs"][0]
type Segment = TranslatedParagraph["source"][0]

interface Props {
  segment: Segment
  onOpenDetails: (morpheme: BasicMorphemeSegment) => void
  levelOfDetail: LevelOfDetail
  cherokeeRepresentation: Dailp.CherokeeOrthography
  pageImages: readonly string[]
  wordPanelDetails: PanelDetails
}

export const DocumentPage = (
  p: Omit<Props, "segment"> & { segment: TranslatedPage }
) => (
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
          levelOfDetail={p.levelOfDetail}
          cherokeeRepresentation={p.cherokeeRepresentation}
          pageImages={p.pageImages}
          wordPanelDetails={p.wordPanelDetails}
        />
      )
    }) ?? null

  const blockStyle =
    p.levelOfDetail > LevelOfDetail.Story
      ? css.documentBlock.wordByWord
      : css.documentBlock.story
  const annotationStyle =
    p.levelOfDetail > LevelOfDetail.Pronunciation
      ? css.annotationSection.wordParts
      : css.annotationSection.story

  let isSelected = false

  if (p.wordPanelDetails.currContents?.__typename === "DocumentParagraph") {
    isSelected = p.wordPanelDetails.currContents.source === p.segment.source
  }

  const detailButton = (
    <CleanButton
      title="View paragraph details"
      onClick={() => {
        p.wordPanelDetails.setCurrContents(p.segment)
      }}
    >
      {isSelected ? (
        <MdCircle size={20} className={css.linkSvg} />
      ) : (
        <MdInfoOutline size={20} className={css.linkSvg} />
      )}
    </CleanButton>
  )

  let wordCSS = css.wordGroup

  if (isSelected) {
    wordCSS = cx(wordCSS, css.selectedWord)
  }

  return (
    <section className={blockStyle}>
      <div className={wordCSS}>
        <div className={annotationStyle}>
          {children}
          {deploymentEnvironment !== Environment.Production &&
            p.levelOfDetail === LevelOfDetail.Story &&
            detailButton}
        </div>
        <p className={css.inlineBlock}>
          {p.segment.translation ?? null}
          {deploymentEnvironment !== Environment.Production &&
            p.levelOfDetail >= LevelOfDetail.Pronunciation &&
            detailButton}
        </p>

        {/*<SegmentAudio/>*/}
      </div>
    </section>
  )
}

/** Displays one segment of the document, which may be a word, block, or phrase. */
export const Segment = (p: Props) => {
  const segment = p.segment

  if (segment.__typename === "AnnotatedForm") {
    return <AnnotatedForm {...p} segment={segment} />
  } else {
    return null
  }
}

export const AnnotatedForm = (
  p: Props & {
    segment: Dailp.FormFieldsFragment
  }
) => {
  if (!p.segment.source) {
    return null
  }

  const { form } = useForm()

  const showAnything = p.levelOfDetail > LevelOfDetail.Story

  if (showAnything) {
    const showSegments = p.levelOfDetail >= LevelOfDetail.Segmentation
    const translation = p.segment.englishGloss.join(", ")
    const isSelected =
      (p.wordPanelDetails.currContents as Dailp.FormFieldsFragment)?.id ===
      p.segment.id

    let wordCSS = showSegments ? css.wordGroup : css.wordGroupInline

    if (isSelected) {
      wordCSS = cx(wordCSS, css.selectedWord)
      p.wordPanelDetails.setCurrContents(
        p.segment
      ) /* This makes sure the word panel updates for changes to the word panel*/
    }

    return (
      <div className={wordCSS} id={`w${p.segment.index}`}>
        <div className={css.syllabaryLayer} lang="chr">
          {p.segment.source}
          <CleanButton
            title={`View word details for '${p.segment.source}'`}
            onClick={() => {
              p.wordPanelDetails.setCurrContents(p.segment)
              form.update("word", p.segment)
            }}
          >
            {isSelected ? (
              <MdCircle size={20} className={css.linkSvg} />
            ) : (
              <MdInfoOutline size={20} className={css.linkSvg} />
            )}
          </CleanButton>
        </div>
        {p.segment.romanizedSource ? (
          <>
            <div>{p.segment.romanizedSource}</div>
            <div>
              {p.segment.phonemic &&
                p.levelOfDetail >= LevelOfDetail.Pronunciation && <div />}
            </div>
          </>
        ) : (
          <FillerLine />
        )}
        {showSegments ? (
          <MorphemicSegmentation
            segments={p.segment.segments}
            onOpenDetails={p.onOpenDetails}
            levelOfDetail={p.levelOfDetail}
            cherokeeRepresentation={p.cherokeeRepresentation}
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
  cherokeeRepresentation: Dailp.CherokeeOrthography
  onOpenDetails: Props["onOpenDetails"]
  levelOfDetail: LevelOfDetail
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
    if (
      segmentation.length > 0 &&
      seg.role &&
      seg.role !== Dailp.WordSegmentRole.Modifier
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
                cherokeeRepresentation={p.cherokeeRepresentation}
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
  cherokeeRepresentation: Dailp.CherokeeOrthography
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
