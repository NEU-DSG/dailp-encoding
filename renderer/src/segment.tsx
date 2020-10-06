import React from "react"
import { styled } from "linaria/react"
import { DialogDisclosure } from "reakit/Dialog"
import { Group } from "reakit/Group"
import { Tooltip, TooltipReference, useTooltipState } from "reakit/Tooltip"
import _ from "lodash"
import {
  ExperienceLevel,
  AnnotationSection,
  TagSet,
} from "./templates/annotated-document"

interface Props {
  segment: GatsbyTypes.Dailp_AnnotatedSeg
  dialog: any
  onOpenDetails: (morpheme: GatsbyTypes.Dailp_MorphemeSegment) => void
  level: ExperienceLevel
  translations: GatsbyTypes.Dailp_Block
  tagSet: TagSet
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
        />
      )) ?? null

    if (p.segment.ty === "BLOCK") {
      return (
        <DocumentBlock>
          <TranslationPara>
            {p.translations?.segments.join(". ") ?? null}.
          </TranslationPara>
          <AnnotationSection>
            {children}
            <div style={{ flexGrow: 1 }} aria-hidden={true} />
          </AnnotationSection>
        </DocumentBlock>
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
): seg is GatsbyTypes.Dailp_AnnotatedForm {
  return "source" in seg
}
function isPhrase(
  seg: GatsbyTypes.Dailp_AnnotatedSeg
): seg is GatsbyTypes.Dailp_AnnotatedPhrase {
  return "parts" in seg
}
function isPageBreak(seg: Dailp_AnnotatedSeg): seg is Dailp_PageBreak {
  return (
    "__typename" in seg && (seg["__typename"] as string).endsWith("PageBreak")
  )
}

/**
 * Displays the break-down of a word into its units of meaning and the English
 * glosses for each morpheme.
 */
const MorphemicSegmentation = (p: {
  segments: readonly GatsbyTypes.Dailp_MorphemeSegment[]
  tagSet: TagSet
  dialog: any
  onOpenDetails: any
  showPhonemicLayer: boolean
}) => {
  // If there is no segmentation, return two line breaks for the
  // morphemic segmentation and morpheme gloss layers.
  if (!p.segments || !p.segments.length) {
    return (
      <>
        <br />
        {p.showPhonemicLayer ? <br /> : null}
      </>
    )
  }

  const segmentDivs = intersperse(
    p.segments.map((segment, i) => (
      <WordSegment key={i}>
        {p.showPhonemicLayer ? segment.morpheme : null}
        <MorphemeSegment
          segment={segment}
          tagSet={p.tagSet}
          dialog={p.dialog}
          onOpenDetails={p.onOpenDetails}
        />
      </WordSegment>
    )),
    _i => <MorphemeDivider showPhonemicLayer={p.showPhonemicLayer} />
  )
  // Add dashes between all morphemes for more visible separation.
  return <GlossLine>{segmentDivs}</GlossLine>
}

export function intersperse<T>(arr: T[], separator: (n: number) => T): T[] {
  return _.flatMap(arr, (a, i) => (i > 0 ? [separator(i - 1), a] : [a]))
}

const MorphemeDivider = (p: { showPhonemicLayer: boolean }) => (
  <WordSegment>
    <span>-</span>
    {p.showPhonemicLayer ? <span>-</span> : null}
  </WordSegment>
)

/** One morpheme that can be clicked to see further details. */
const MorphemeSegment = (p: {
  segment: GatsbyTypes.Dailp_MorphemeSegment
  tagSet: TagSet
  dialog: any
  onOpenDetails: (segment: Dailp_MorphemeSegment) => void
}) => {
  let gloss = p.segment.gloss
  if (p.tagSet === TagSet.Crg) {
    gloss = p.segment.matchingTag?.crg ?? p.segment.gloss
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
  margin-right: 2px;
`

const MorphemeButton = styled(DialogDisclosure)`
  font-family: inherit;
  font-size: inherit;
  color: inherit;
  border: none;
  padding: 0px 8px;
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

const AnnotatedForm = (
  p: Props & { segment: GatsbyTypes.Dailp_AnnotatedForm }
) => {
  const tooltip = useTooltipState()
  return (
    <WordGroup id={`w${p.segment.index}`}>
      <TooltipReference {...tooltip}>{p.segment.source}</TooltipReference>
      <Tooltip {...tooltip}>{p.segment.commentary}</Tooltip>
      <div>{p.segment.simplePhonetics ?? <br />}</div>
      {p.level > ExperienceLevel.Beginner ? (
        <MorphemicSegmentation
          segments={p.segment.segments}
          dialog={p.dialog}
          onOpenDetails={p.onOpenDetails}
          showPhonemicLayer={p.level > ExperienceLevel.Intermediate}
        />
      ) : null}
      <div>{p.segment.englishGloss.join(", ")}</div>
    </WordGroup>
  )
}

const WordGroup = styled(Group)`
  margin: 16px 20px;
  margin-bottom: 48px;
`

const TranslationPara = styled.p`
  margin: 0 16px;
<<<<<<< HEAD
`

const DocumentBlock = styled.div`
  margin: 4em 0;
=======
>>>>>>> :sparkles: Convert between tag sets in UI
`
