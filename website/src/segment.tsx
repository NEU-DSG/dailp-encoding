import React from "react"
import { css, cx } from "linaria"
import { DialogDisclosure, DialogStateReturn } from "reakit/Dialog"
import { Tooltip, TooltipReference, useTooltipState } from "reakit/Tooltip"
import { MdInfoOutline } from "react-icons/md"
import _ from "lodash"
import {
  ViewMode,
  TagSet,
  BasicMorphemeSegment,
  morphemeDisplayTag,
} from "./types"
import theme, { hideOnPrint, std, typography, withBg } from "./theme"

interface Props {
  segment: GatsbyTypes.Dailp_AnnotatedSeg
  dialog: DialogStateReturn
  onOpenDetails: (morpheme: BasicMorphemeSegment) => void
  viewMode: ViewMode
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
            viewMode={p.viewMode}
            translations={p.translations}
            tagSet={p.tagSet}
            pageImages={p.pageImages}
          />
        )
      }) ?? null

    if (p.segment.ty === "BLOCK") {
      return (
        <section
          className={cx(documentBlock, p.viewMode > ViewMode.Story && bordered)}
        >
          <div
            className={cx(
              annotationSection,
              p.viewMode <= ViewMode.Story && storySection
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
  } else if (isPageBreak(p.segment)) {
    const num = p.segment.index + 1
    return (
      <div
        id={`document-page-${num}`}
        className={pageBreak}
        aria-label={`Start of page ${num}`}
      >
        Page {num}
      </div>
    )
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
  const showAnything = p.viewMode > ViewMode.Story
  if (showAnything) {
    const showSegments = p.viewMode >= ViewMode.Segmentation
    const translation = p.segment.englishGloss.join(", ")
    return (
      <div className={wordGroup} id={`w${p.segment.index}`}>
        <div className={syllabaryLayer} lang="chr">
          {p.segment.source}
          {p.segment.commentary && p.viewMode >= ViewMode.Pronunciation && (
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
            level={p.viewMode}
            tagSet={p.tagSet}
          />
        ) : null}
        {translation.length ? <div>&lsquo;{translation}&rsquo;</div> : <br />}
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

const WordCommentaryInfo = (p: { commentary: string }) => (
  <WithTooltip
    hint={p.commentary}
    aria-label="Commentary on this word"
    className={cx(infoIcon, hideOnPrint)}
  >
    <MdInfoOutline size={20} />
  </WithTooltip>
)

const WithTooltip = (p: {
  hint: string
  children: any
  "aria-label"?: string
  className?: string
}) => {
  const tooltip = useTooltipState()
  return (
    <>
      <TooltipReference {...tooltip} as="span" className={p.className}>
        {p.children}
      </TooltipReference>
      <Tooltip {...tooltip} className={std.tooltip}>
        {p.hint}
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
  level: ViewMode
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
      <div className={italicSegmentation}>
        {p
          .segments!.map(function (segment) {
            // Adapt the segment shape to the chosen experience level.
            let seg = segment.shapeTth
            if (p.level === ViewMode.AnalysisDt) {
              seg = segment.shapeDt
            } else if (p.level === ViewMode.Segmentation) {
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

const italicSegmentation = css`
  font-style: italic;
`

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
  const buttonStyle = cx(
    morphemeButton,
    matchingTag ? std.smallCaps : inheritFont
  )

  let content = <>{gloss}</>
  if (matchingTag && matchingTag.title) {
    content = (
      <WithTooltip className={atLeastThin} hint={matchingTag.title}>
        {gloss}
      </WithTooltip>
    )
  } else if (gloss === "?") {
    content = (
      <WithTooltip
        className={atLeastThin}
        hint="Unanalyzed or unfamiliar segment"
      >
        {gloss}
      </WithTooltip>
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

const pageBreak = css`
  display: block;
  width: 40%;
  margin: auto;
  text-align: center;
  border-top: 1px solid gray;
  padding-top: ${typography.rhythm(0.5)};

  &:first-child,
  &:last-child {
    display: none;
  }

  ${theme.mediaQueries.print} {
    display: none;
  }
`

const atLeastThin = css`
  display: inline-block;
  min-width: 1rem;
`

const inheritFont = css`
  font-family: inherit;
  font-size: inherit;
`

const morphemeButton = css`
  color: inherit;
  border: none;
  padding: 0;
  display: inline-block;
  background: none;
`

const wordGroup = css`
  position: relative;
  margin: ${typography.rhythm(1 / 2)} 0;
  margin-bottom: ${typography.rhythm(1 / 2)};
  padding: ${typography.rhythm(1 / 2)} 0.5rem;
  padding-right: 0;
  border: 2px solid ${theme.colors.borders};
  border-radius: 2px;
  page-break-inside: avoid;
  break-inside: avoid;
  line-height: ${typography.rhythm(1)};
  ${theme.mediaQueries.medium} {
    padding: 0;
    border: none;
    margin: ${typography.rhythm(1 / 2)} 3rem ${typography.rhythm(1)} 0;
  }
  ${theme.mediaQueries.print} {
    padding: 0;
    border: none;
    margin: 0rem 3.5rem ${typography.rhythm(1.5)} 0;
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
  margin-top: ${typography.rhythm(1.5)};
  margin-bottom: ${typography.rhythm(1)};
  padding-bottom: ${typography.rhythm(1)};
  ${theme.mediaQueries.print} {
    padding-bottom: ${typography.rhythm(1 / 4)};
    margin-bottom: ${typography.rhythm(2)};
  }
`

const bordered = css`
  ${theme.mediaQueries.medium}, print {
    border-bottom: 1px solid ${theme.colors.text};
    &:last-of-type {
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
  margin-bottom: ${typography.rhythm(1 / 2)};
  ${theme.mediaQueries.medium}, print {
    & > * {
      display: inline-block;
    }
  }
`

const storySection = css`
  flex-flow: row wrap;
`
