import React from "react"
import { css, cx } from "linaria"
import { DialogDisclosure, DialogStateReturn } from "reakit/Dialog"
import { Tooltip, TooltipReference, useTooltipState } from "reakit/Tooltip"
import _ from "lodash"
import { ExperienceLevel, TagSet, BasicMorphemeSegment } from "./types"
import theme from "./theme"

interface Props {
  segment: GatsbyTypes.Dailp_AnnotatedSeg
  dialog: DialogStateReturn
  onOpenDetails: (morpheme: BasicMorphemeSegment) => void
  level: ExperienceLevel
  translations: GatsbyTypes.Dailp_TranslationBlock
  tagSet: TagSet
  pageImages: readonly string[]
}

/** Displays one segment of the document, which may be a word, block, or phrase. */
export const Segment = (p: Props) => {
  if (isForm(p.segment)) {
    return <AnnotatedForm {...p} segment={p.segment} />
  } else if (isPhrase(p.segment)) {
    const children =
      p.segment.parts?.map(function (seg, i) {
        return (
          <Segment
            key={i}
            segment={seg}
            dialog={p.dialog}
            onOpenDetails={p.onOpenDetails}
            level={p.level}
            translations={p.translations}
            tagSet={p.tagSet}
            pageImages={p.pageImages}
          />
        )
      }) ?? null

    if (p.segment.ty === "BLOCK") {
      return (
        <section
          className={cx(
            documentBlock,
            p.level > ExperienceLevel.Story && bordered
          )}
        >
          <div
            className={cx(
              annotationSection,
              p.level <= ExperienceLevel.Story && storySection
            )}
          >
            {children}
          </div>
          <p>{p.translations?.text ?? null}.</p>
        </section>
      )
    } else {
      return <>{children}</>
    }
  } else {
    return null
  }
}

function isForm(
  seg: GatsbyTypes.Dailp_AnnotatedSeg
): seg is GatsbyTypes.FormFieldsFragment {
  return "source" in seg
}
function isPhrase(
  seg: GatsbyTypes.Dailp_AnnotatedSeg
): seg is GatsbyTypes.Dailp_AnnotatedPhrase {
  return "parts" in seg
}
function isPageBreak(
  seg: GatsbyTypes.Dailp_AnnotatedSeg
): seg is GatsbyTypes.Dailp_PageBreak {
  return (
    "__typename" in seg &&
    (seg["__typename"] as string).endsWith("PageBreak") &&
    "index" in seg
  )
}

export const AnnotatedForm = (
  p: Props & { segment: GatsbyTypes.FormFieldsFragment }
) => {
  if (!p.segment.source) {
    return null
  }
  const showAnything = p.level > ExperienceLevel.Story
  if (showAnything) {
    const showSegments = p.level > ExperienceLevel.Basic
    return (
      <div className={wordGroup} id={`w${p.segment.index}`}>
        <div className={syllabaryLayer} lang="chr">
          {p.segment.source}
        </div>
        <div>{p.segment.simplePhonetics ?? <br />}</div>
        {showSegments ? (
          <MorphemicSegmentation
            segments={p.segment.segments}
            dialog={p.dialog}
            onOpenDetails={p.onOpenDetails}
            showAdvanced={p.level > ExperienceLevel.Learner}
            tagSet={p.tagSet}
          />
        ) : null}
        <div>{p.segment.englishGloss.join(", ")}</div>
      </div>
    )
  } else {
    return (
      <span className={plainSyllabary} id={`w${p.segment.index}`} lang="chr">
        {p.segment.source}
      </span>
    )
  }
}

/**
 * Displays the break-down of a word into its units of meaning and the English
 * glosses for each morpheme.
 */
const MorphemicSegmentation = (p: {
  segments: GatsbyTypes.FormFieldsFragment["segments"]
  tagSet: TagSet
  dialog: Props["dialog"]
  onOpenDetails: Props["onOpenDetails"]
  showAdvanced: boolean
}) => {
  // If there is no segmentation, return two line breaks for the
  // morphemic segmentation and morpheme gloss layers.
  if (!p.segments || !p.segments.length) {
    return (
      <>
        <br />
        <br />
      </>
    )
  }

  return (
    <>
      <div className={glossLine}>
        {p
          .segments!.map(function (segment) {
            let seg = p.showAdvanced ? segment.morpheme : segment.simpleMorpheme
            if (segment.nextSeparator) {
              return seg + segment.nextSeparator
            } else {
              return seg
            }
          })
          .join("")}
      </div>

      <div className={glossLine}>
        {intersperse(
          p.segments!.map(function (segment, i) {
            return (
              <MorphemeSegment
                key={i}
                segment={segment}
                tagSet={p.tagSet}
                dialog={p.dialog}
                onOpenDetails={p.onOpenDetails}
              />
            )
          }),
          function (i) {
            return (
              <span key={100 * (i + 1)}>{p.segments![i].nextSeparator}</span>
            )
          }
        )}
      </div>
    </>
  )
}

function intersperse<T>(arr: T[], separator: (n: number) => T): T[] {
  return _.flatMap(arr, (a, i) => (i > 0 ? [separator(i - 1), a] : [a]))
}

/** One morpheme that can be clicked to see further details. */
const MorphemeSegment = (p: {
  segment: BasicMorphemeSegment
  tagSet: TagSet
  dialog: Props["dialog"]
  onOpenDetails: Props["onOpenDetails"]
}) => {
  let matchingTag = null
  if (p.segment.matchingTag) {
    const tag = p.segment.matchingTag!
    if (p.tagSet === TagSet.Learner) {
      matchingTag = tag.learner ?? tag.crg
    } else if (p.tagSet === TagSet.Taoc) {
      matchingTag = tag.taoc
    } else if (p.tagSet === TagSet.Crg) {
      matchingTag = tag.crg
    }
  }
  const gloss = matchingTag?.tag || p.segment.gloss

  if (p.segment.matchingTag) {
    const tooltip = useTooltipState()
    return (
      <>
        <DialogDisclosure
          {...p.dialog}
          className={morphemeButton}
          onClick={() => p.onOpenDetails(p.segment)}
        >
          <Tooltip className={withBg} {...tooltip}>
            {matchingTag.definition}
          </Tooltip>
          <TooltipReference {...tooltip}>{gloss}</TooltipReference>
        </DialogDisclosure>
      </>
    )
  } else if (gloss) {
    return (
      <DialogDisclosure
        {...p.dialog}
        className={morphemeButton}
        onClick={() => p.onOpenDetails(p.segment)}
      >
        {gloss}
      </DialogDisclosure>
    )
  } else {
    return null
  }
}

const withBg = css`
  background-color: ${theme.colors.body};
  padding: ${theme.rhythm / 4}em;
  border: 1px solid ${theme.colors.text};
  ${theme.mediaQueries.medium} {
    max-width: 70vw;
  }
`

const morphemeButton = css`
  font-family: inherit;
  font-size: inherit;
  color: inherit;
  border: none;
  padding: 0;
  cursor: pointer;
  border-bottom: 1px solid transparent;
  &:hover {
    border-bottom: 1px solid darkblue;
  }
`

const glossLine = css`
  display: flex;
  flex-flow: row wrap;
`

const wordGroup = css`
  position: relative;
  margin: ${theme.rhythm / 2}rem 0;
  margin-bottom: ${theme.rhythm / 2}rem;
  padding: ${theme.rhythm / 2}rem 0.5rem;
  padding-right: 0;
  border: 2px solid ${theme.colors.borders};
  border-radius: 2px;
  ${theme.mediaQueries.medium} {
    padding: 0;
    border: none;
    margin: ${theme.rhythm / 2}rem 3rem ${theme.rhythm}rem 0;
  }
`

const syllabaryLayer = css`
  font-family: ${theme.fonts.cherokee};
  font-size: 1.25rem;
`

const plainSyllabary = css`
  font-family: ${theme.fonts.cherokee};
  font-size: 1.25rem;
  margin-right: 0.5rem;
`

const documentBlock = css`
  margin-top: ${theme.rhythm}rem;
  padding-bottom: ${theme.rhythm / 2}rem;
  margin-bottom: ${theme.rhythm / 2}rem;
`

const bordered = css`
  ${theme.mediaQueries.medium} {
    border-bottom: 2px solid ${theme.colors.text};
  }
`

const annotationSection = css`
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  margin-bottom: ${theme.rhythm / 2}rem;
  ${theme.mediaQueries.medium} {
    flex-flow: row wrap;
  }
`

const storySection = css`
  flex-flow: row wrap;
`
