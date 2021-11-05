import React from "react"
import { css } from "@emotion/react"
import { DialogDisclosure, DialogStateReturn } from "reakit/Dialog"
import { Tooltip } from "@reach/tooltip"
import { MdInfoOutline } from "react-icons/md"
import { flatMap } from "lodash"
import {
  ViewMode,
  TagSet,
  BasicMorphemeSegment,
  PhoneticRepresentation,
  morphemeDisplayTag,
} from "./types"
import theme, { hideOnPrint, std, typography, withBg } from "./theme"
import "@reach/tooltip/styles.css"
import {FormAudio} from "./audio-player"
import {Howl} from 'howler';


interface Props {
  segment: GatsbyTypes.Dailp_AnnotatedSeg
  dialog: DialogStateReturn
  onOpenDetails: (morpheme: BasicMorphemeSegment) => void
  viewMode: ViewMode
  translations: GatsbyTypes.Dailp_TranslationBlock
  tagSet: TagSet
  pageImages: readonly string[]
  phoneticRepresentation: PhoneticRepresentation
}

/** Displays one segment of the document, which may be a word, block, or phrase. */
export const Segment = (p: Props & {howl?: Howl}) => {
  if (isForm(p.segment)) {
    return <AnnotatedForm {...p} segment={p.segment}/>
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
            phoneticRepresentation={p.phoneticRepresentation}
          />
        )
      }) ?? null

    if (p.segment.ty === "BLOCK") {
      return (
        <section css={[documentBlock, p.viewMode > ViewMode.Story && bordered]}>
          <div
            css={[
              annotationSection,
              p.viewMode <= ViewMode.Story && storySection,
            ]}
          >
            {children}
          </div>
          <p>{p.translations?.text ?? null}</p>
          {/*<SegmentAudio/>*/}
        </section>
      )
    } else {
      return <>{children}</>
    }
  } else if (isPageBreak(p.segment) && p.segment.index > 0) {
    const num = p.segment.index + 1
    return (
      <div
        id={`document-page-${num}`}
        css={pageBreak}
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
  p: Props & { segment: GatsbyTypes.FormFieldsFragment}
) => {
  if (!p.segment.source) {
    return null
  }
  const showAnything = p.viewMode > ViewMode.Story
  if (showAnything) {
    const showSegments = p.viewMode >= ViewMode.Segmentation
    const translation = p.segment.englishGloss.join(", ")
    const worcesterValues = p.phoneticRepresentation == PhoneticRepresentation.Worcester

    return (
      <div css={wordGroup} id={`w${p.segment.index}`}>
        <div css={syllabaryLayer} lang="chr">
          {p.segment.source}
          {p.segment.commentary && p.viewMode >= ViewMode.Pronunciation && (
            <WordCommentaryInfo commentary={p.segment.commentary} />
          )}
        </div>
        {p.segment.simplePhonetics ? (
          <div>
            {worcesterValues ? toWorcester(p.segment.simplePhonetics) : p.segment.simplePhonetics}
            {p.segment.audioTrack &&
            <FormAudio
              endTime={p.segment.audioTrack.endTime}
              index={p.segment.audioTrack.index}
              parentTrack=""
              resourceUrl={p.segment.audioTrack.resourceUrl}
              startTime={p.segment.audioTrack.startTime}
            />}
            {p.segment.phonemic && p.viewMode >= ViewMode.Pronunciation && (
              <div />
            )}
          </div>
        ) : (
          (p.segment.audioTrack &&
                <div css={css`padding-left:40%;`}>
                  <FormAudio
                    endTime={p.segment.audioTrack.endTime}
                   index={p.segment.audioTrack.index}
                   parentTrack=""
                  resourceUrl={p.segment.audioTrack.resourceUrl}
                  startTime={p.segment.audioTrack.startTime}
                />
              </div>)
          || <br />
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
      <span css={plainSyllabary} id={`w${p.segment.index}`} lang="chr">
        {p.segment.source}
      </span>
    )
  }
}

/// Converts DAILP's learner-oriented simple phonetics representation to
/// a more traditional rendering in Worcester's syllabary values
const toWorcester = (source: string): string => {
    return source.replace(/([kg]w)/gi, "qu").replace(/j/gi, "ts")
}

const WordCommentaryInfo = (p: { commentary: string }) => (
  <WithTooltip hint={p.commentary} aria-label="Commentary on this word">
    <span css={[infoIcon, hideOnPrint]}>
      <MdInfoOutline size={20} />
    </span>
  </WithTooltip>
)

const WithTooltip = (p: {
  hint: string
  children: any
  "aria-label"?: string
  className?: string
}) => (
  <Tooltip
    css={std.tooltip}
    label={p.hint || ""}
    className={p.className}
    aria-label={p["aria-label"]}
  >
    {p.children}
  </Tooltip>
)

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
      <div css={italicSegmentation}>
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
              <React.Fragment key={100 * (i + 1)}>
                {p.segments![i].nextSeparator}
              </React.Fragment>
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
  return flatMap(arr, (a, i) => (i > 0 ? [separator(i - 1), a] : [a]))
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
  const buttonStyle = [
    atLeastThin,
    morphemeButton,
    matchingTag ? std.smallCaps : inheritFont,
  ]

  if (matchingTag && matchingTag.title) {
    return (
      <WithTooltip hint={matchingTag.title}>
        <DialogDisclosure
          {...p.dialog}
          css={buttonStyle}
          onClick={() => p.onOpenDetails(p.segment)}
        >
          {gloss}
        </DialogDisclosure>
      </WithTooltip>
    )
  } else if (gloss === "?") {
    return (
      <WithTooltip hint="Unanalyzed or unfamiliar segment">
        <DialogDisclosure
          {...p.dialog}
          css={buttonStyle}
          onClick={() => p.onOpenDetails(p.segment)}
        >
          {gloss}
        </DialogDisclosure>
      </WithTooltip>
    )
  } else {
    return (
      <DialogDisclosure
        {...p.dialog}
        css={buttonStyle}
        onClick={() => p.onOpenDetails(p.segment)}
      >
        {gloss}
      </DialogDisclosure>
    )
  }
}

const pageBreak = css`
  display: block;
  width: 40%;
  margin: auto;
  text-align: center;
  border-top: 1px solid gray;
  padding-top: ${typography.rhythm(0.5)};

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
