import React from "react"
import { styled } from "linaria/react"
import { DialogDisclosure, DialogStateReturn } from "reakit/Dialog"
import { Group } from "reakit/Group"
import _ from "lodash"
import {
  ExperienceLevel,
  AnnotationSection,
  TagSet,
} from "./templates/annotated-document"
import theme from "./theme"

export type BasicMorphemeSegment = NonNullable<
  GatsbyTypes.FormFieldsFragment["segments"]
>[0]

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
      p.segment.parts?.map((seg, i) => (
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
      )) ?? null

    if (p.segment.ty === "BLOCK") {
      return (
        <DocumentBlock>
          <AnnotationSection>
            {children}
            <div style={{ flexGrow: 1 }} aria-hidden={true} />
          </AnnotationSection>
          <TranslationPara>
            {p.translations?.segments.join(". ") ?? null}.
          </TranslationPara>
        </DocumentBlock>
      )
    } else {
      return <>{children}</>
    }
    // } else if (isPageBreak(p.segment)) {
    // return <PageImage src={p.pageImages[p.segment.index]} />
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

const AnnotatedForm = (
  p: Props & { segment: GatsbyTypes.FormFieldsFragment }
) => {
  if (!p.segment.source) {
    return null
  }
  const showSegments = p.level > ExperienceLevel.Basic
  return (
    <WordGroup id={`w${p.segment.index}`}>
      <SyllabaryLayer>{p.segment.source}</SyllabaryLayer>
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
    <WordSegment>
      {p.segments!.map((segment, i) => {
        let seg = p.showAdvanced ? segment.morpheme : segment.simpleMorpheme
        return seg + (segment.nextSeparator || "")
      })}
      <GlossLine>
        {intersperse(
          p.segments!.map((segment, i) => (
            <MorphemeSegment
              key={i}
              segment={segment}
              tagSet={p.tagSet}
              dialog={p.dialog}
              onOpenDetails={p.onOpenDetails}
            />
          )),
          (i) => (
            <span key={100 * (i + 1)}>{p.segments![i].nextSeparator}</span>
          )
        )}
      </GlossLine>
    </WordSegment>
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
      p.segment.matchingTag?.learner ??
      p.segment.matchingTag?.crg ??
      p.segment.gloss
  }
  return (
    <MorphemeButton {...p.dialog} onClick={() => p.onOpenDetails(p.segment)}>
      {gloss}
    </MorphemeButton>
  )
}

const WordSegment = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
`

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

const GlossLine = styled.span`
  display: flex;
  flex-flow: row nowrap;
`

const WordGroup = styled(Group)`
  margin: 1rem ${theme.edgeSpacing};
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border: 2px solid ${theme.colors.header};
  border-radius: 2px;
  ${theme.mediaQueries.medium} {
    margin-bottom: 2rem;
    padding: 0;
    border: none;
  }
`

const SyllabaryLayer = styled.div`
  font-size: 1.2rem;
`

const TranslationPara = styled.p`
  margin: 0 ${theme.edgeSpacing};
`

const DocumentBlock = styled.div`
  margin-top: 2rem;
  margin-bottom: 3rem;
`
