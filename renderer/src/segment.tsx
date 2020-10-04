import React from "react"
import { styled } from "linaria/react"
import { DialogDisclosure } from "reakit/Dialog"
import { Group } from "reakit/Group"
import {
  ExperienceLevel,
  AnnotationSection,
} from "./templates/annotated-document"
import {
  Dailp_MorphemeSegment,
  Dailp_AnnotatedSeg,
  Dailp_AnnotatedForm,
  Dailp_AnnotatedPhrase,
  Dailp_Block,
  Dailp_PageBreak,
} from "../graphql-types"

/** Displays one segment of the document, which may be a word, block, or phrase. */
export const Segment = (p: {
  segment: Dailp_AnnotatedSeg
  dialog: any
  onOpenDetails: (morpheme: Dailp_MorphemeSegment) => void
  level: ExperienceLevel
  translations: Dailp_Block
}) => {
  if (isForm(p.segment)) {
    return (
      <AnnotatedWord id={`w${p.segment.index}`}>
        <div>{p.segment.source}</div>
        <div>{p.segment.simplePhonetics || <br />}</div>
        {p.level > ExperienceLevel.Beginner ? (
          <MorphemicSegmentation
            segments={p.segment.segments}
            dialog={p.dialog}
            onOpenDetails={p.onOpenDetails}
          />
        ) : null}
        <div>{p.segment.englishGloss.join(", ")}</div>
      </AnnotatedWord>
    )
  } else if (isPhrase(p.segment)) {
    const children = p.segment.parts?.map((seg, i) => (
      <Segment
        key={i}
        segment={seg}
        dialog={p.dialog}
        onOpenDetails={p.onOpenDetails}
        level={p.level}
        translations={p.translations}
      />
    ))

    if (p.segment.ty === "BLOCK") {
      return (
        <div>
          <AnnotationSection>
            {children || null}
            <div style={{ flexGrow: 1 }} aria-hidden={true} />
          </AnnotationSection>
          <TranslationPara>
            {p.translations?.segments.join(". ") || null}.
          </TranslationPara>
        </div>
      )
    } else {
      return children ? <>{children}</> : null
    }
  } else {
    return null
  }
}

function isForm(seg: Dailp_AnnotatedSeg): seg is Dailp_AnnotatedForm {
  return "source" in seg
}
function isPhrase(seg: Dailp_AnnotatedSeg): seg is Dailp_AnnotatedPhrase {
  return "parts" in seg
}

/**
 * Displays the break-down of a word into its units of meaning and the English
 * glosses for each morpheme.
 */
const MorphemicSegmentation = (p: {
  segments: Dailp_MorphemeSegment[]
  dialog: any
  onOpenDetails: any
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

  const segmentDivs = p.segments.map((segment, i) => (
    <WordSegment key={i}>
      <MorphemeSegment
        segment={segment}
        dialog={p.dialog}
        onOpenDetails={p.onOpenDetails}
      />
      {segment?.gloss}
    </WordSegment>
  ))
  // Add dashes between all morphemes for more visible separation.
  return <GlossLine>{segmentDivs}</GlossLine>
}

/** One morpheme that can be clicked to see further details. */
const MorphemeSegment = (p: {
  segment: Dailp_MorphemeSegment
  dialog: any
  onOpenDetails: (segment: Dailp_MorphemeSegment) => void
}) => (
  <MorphemeButton {...p.dialog} onClick={() => p.onOpenDetails(p.segment)}>
    {p.segment.morpheme}
  </MorphemeButton>
)

const WordSegment = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  margin-right: 8px;
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

const AnnotatedWord = styled(Group)`
  margin: 16px 20px;
  margin-bottom: 48px;
`

const TranslationPara = styled.p`
  margin: 0 16px;
  margin-top: 0;
  margin-bottom: 8em;
`
