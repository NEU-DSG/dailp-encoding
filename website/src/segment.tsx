import React from "react"
import { css, cx } from "linaria"
import { styled } from "linaria/react"
import { DialogDisclosure, DialogStateReturn } from "reakit/Dialog"
import { Group } from "reakit/Group"
import _ from "lodash"
import { ExperienceLevel, TagSet, BasicMorphemeSegment } from "./types"
import theme from "./theme"

export const AnnotationSection = styled.section`
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  margin-bottom: ${theme.rhythm / 2}rem;
  ${theme.mediaQueries.medium} {
    flex-flow: row wrap;
  }
`


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
          <AnnotationSection as="div">{children}</AnnotationSection>
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
      <WordGroup id={`w${p.segment.index}`}>
        <SyllabaryLayer lang="chr">{p.segment.source}</SyllabaryLayer>
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
      </WordGroup>
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
      <GlossLine>
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
      </GlossLine>

      <GlossLine>
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
      </GlossLine>
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
  let gloss = p.segment.gloss
  if (p.tagSet === TagSet.Learner) {
    gloss =
      p.segment.matchingTag?.learner || p.segment.matchingTag?.crg || gloss
  }

  if (gloss) {
    return (
      <MorphemeButton {...p.dialog} onClick={() => p.onOpenDetails(p.segment)}>
        {gloss}
      </MorphemeButton>
    )
  } else {
    return null
  }
}

const MorphemeButton = styled(DialogDisclosure)`
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

const GlossLine = styled.div`
  display: flex;
  flex-flow: row wrap;
`

const WordGroup = styled(Group)`
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



const SyllabaryLayer = styled.div`
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
