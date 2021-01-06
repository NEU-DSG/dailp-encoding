import React from "react"
import { css, cx } from "linaria"
import { DialogDisclosure, DialogStateReturn } from "reakit/Dialog"
import { Tooltip, TooltipReference, useTooltipState } from "reakit/Tooltip"
import { MdInfoOutline } from "react-icons/md"
import _ from "lodash"
import {
  ExperienceLevel,
  TagSet,
  BasicMorphemeSegment,
  morphemeDisplayTag,
} from "./types"
import theme, { hideOnPrint, std, withBg } from "./theme"

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
          <p>{p.translations?.text ?? null}</p>
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
    const translation = p.segment.englishGloss.join(", ")
    return (
      <div className={wordGroup} id={`w${p.segment.index}`}>
        <div className={syllabaryLayer} lang="chr">
          {p.segment.source}
          {p.segment.commentary && showSegments && (
            <WordCommentaryInfo commentary={p.segment.commentary} />
          )}
        </div>
        {p.segment.simplePhonetics ? (
          <div>{p.segment.simplePhonetics}</div>
        ) : (
          <br />
        )}
        {showSegments ? (
          <MorphemicSegmentation
            segments={p.segment.segments}
            dialog={p.dialog}
            onOpenDetails={p.onOpenDetails}
            level={p.level}
            tagSet={p.tagSet}
          />
        ) : null}
        {translation.length ? <div>{translation}</div> : <br />}
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

const WordCommentaryInfo = (p: { commentary: string }) => {
  const tooltip = useTooltipState()
  return (
    <>
      <TooltipReference
        {...tooltip}
        as="span"
        aria-label="Commentary on this word"
        className={cx(infoIcon, hideOnPrint)}
      >
        <MdInfoOutline size={20} />
      </TooltipReference>
      <Tooltip {...tooltip} className={std.tooltip}>
        {p.commentary}
      </Tooltip>
    </>
  )
}

const infoIcon = css`
  margin-left: 0.4rem;
  cursor: help;
  svg {
    fill: ${theme.colors.link};
  }
`

/**
 * Displays the break-down of a word into its units of meaning and the English
 * glosses for each morpheme.
 */
const MorphemicSegmentation = (p: {
  segments: GatsbyTypes.FormFieldsFragment["segments"]
  tagSet: TagSet
  dialog: Props["dialog"]
  onOpenDetails: Props["onOpenDetails"]
  level: ExperienceLevel
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
      <div>
        {p
          .segments!.map(function (segment) {
            // Adapt the segment shape to the chosen experience level.
            let seg = segment.shapeTth
            if (p.level === ExperienceLevel.AdvancedDt) {
              seg = segment.shapeDt
            } else if (p.level === ExperienceLevel.Learner) {
              seg = segment.shapeDtSimple
            }

            if (segment.nextSeparator) {
              return seg + segment.nextSeparator
            } else {
              return seg
            }
          })
          .join("")}
      </div>

      <div>
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
  const matchingTag = morphemeDisplayTag(p.segment.matchingTag, p.tagSet)
  const gloss = matchingTag?.tag || p.segment.gloss
  // Display functional tags in small-caps, per interlinear typesetting practice.
  const buttonStyle = matchingTag ? smallCaps : morphemeButton

  let content = <>{gloss}</>
  if (matchingTag && matchingTag.title) {
    content = (
      <abbr className={atLeastThin} title={matchingTag.title}>
        {gloss}
      </abbr>
    )
  } else if (gloss === "?") {
    content = (
      <abbr className={atLeastThin} title="Unanalyzed or unfamiliar segment">
        {gloss}
      </abbr>
    )
  }

  return (
    <DialogDisclosure
      {...p.dialog}
      className={buttonStyle}
      onClick={() => p.onOpenDetails(p.segment)}
    >
      {content}
    </DialogDisclosure>
  )
}

const smallCaps = css`
  font-family: ${theme.fonts.smallCaps};
  text-transform: lowercase;
  color: inherit;
  border: none;
  padding: 0;
  border-bottom: 1px solid transparent;
  display: inline-block;
  &:hover {
    border-bottom: 1px solid darkblue;
  }
`

const atLeastThin = css`
  display: inline-block;
  min-width: 1rem;
`

const morphemeButton = css`
  font-family: inherit;
  font-size: inherit;
  color: inherit;
  border: none;
  padding: 0;
  border-bottom: 1px solid transparent;
  display: inline-block;
  &:hover {
    border-bottom: 1px solid darkblue;
  }
`

const wordGroup = css`
  position: relative;
  margin: ${theme.rhythm / 2}rem 0;
  margin-bottom: ${theme.rhythm / 2}rem;
  padding: ${theme.rhythm / 2}rem 0.5rem;
  padding-right: 0;
  border: 2px solid ${theme.colors.borders};
  border-radius: 2px;
  page-break-inside: avoid;
  break-inside: avoid;
  ${theme.mediaQueries.medium} {
    padding: 0;
    border: none;
    margin: ${theme.rhythm / 2}rem 3rem ${theme.rhythm}rem 0;
  }
  ${theme.mediaQueries.print} {
    padding: 0;
    border: none;
    margin: 0rem 3.5rem ${theme.rhythm * 1.5}rem 0;
  }
`

const syllabaryLayer = css`
  font-family: ${theme.fonts.cherokee};
  font-size: 1.15rem;
`

const plainSyllabary = css`
  font-family: ${theme.fonts.cherokee};
  font-size: 1.15rem;
  margin-right: 1ch;
`

const documentBlock = css`
  position: relative;
  display: block;
  break-after: avoid;
  margin-top: ${theme.rhythm}rem;
  margin-bottom: ${theme.rhythm * 2}rem;
  ${theme.mediaQueries.print} {
    padding-bottom: ${theme.rhythm / 4}rem;
    margin-bottom: ${theme.rhythm * 2}rem;
  }
`

const bordered = css`
  ${theme.mediaQueries.medium}, print {
    border-bottom: 2px solid ${theme.colors.text};
    &:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
  }
  ${theme.mediaQueries.print} {
    border-bottom: 1px solid black;
  }
`

const annotationSection = css`
  width: 100%;
  position: relative;
  display: block;
  margin-bottom: ${theme.rhythm / 2}rem;
  ${theme.mediaQueries.medium}, print {
    margin-bottom: ${theme.rhythm / 2}rem;
    & > * {
      display: inline-block;
    }
  }
`

const storySection = css`
  flex-flow: row wrap;
`
