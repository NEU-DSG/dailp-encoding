import React from "react"
import { styled } from "linaria/react"
import { DialogDisclosure } from "reakit/Dialog"
import { Group } from "reakit/Group"

/** Displays one segment of the document, which may be a word, block, or phrase. */
export const Segment = ({ segment, dialog, onOpenDetails }) => {
  const ty = segment.__typename
  if (ty.endsWith("AnnotatedWord")) {
    return (
      <AnnotatedWord id={`w${segment.index}`}>
        <div>{segment.source}</div>
        <div>{segment.simplePhonetics || <br />}</div>
        <MorphemicSegmentation
          segments={segment.morphemicSegmentation}
          glosses={segment.morphemeGloss}
          dialog={dialog}
          onOpenDetails={onOpenDetails}
        />
        <div>{segment.englishGloss}</div>
      </AnnotatedWord>
    )
  } else if (ty.endsWith("AnnotatedPhrase")) {
    return (
      segment.parts?.map((seg, i) => (
        <Segment
          key={i}
          segment={seg}
          dialog={dialog}
          onOpenDetails={onOpenDetails}
        />
      )) || null
    )
  } else {
    return null
  }
}

/**
 * Displays the break-down of a word into its units of meaning and the English
 * glosses for each morpheme.
 */
const MorphemicSegmentation = ({
  segments,
  glosses,
  dialog,
  onOpenDetails,
}) => {
  if (!segments || (segments.length === 1 && !segments[0])) {
    return <br />
  }

  const segmentDivs = segments.map((segment, i) => (
    <div key={i}>
      <MorphemeSegment
        segment={segment}
        gloss={glosses && glosses[i]}
        dialog={dialog}
        onOpenDetails={onOpenDetails}
      />
      {glosses && glosses[i]}
    </div>
  ))
  // Add dashes between all morphemes for more visible separation.
  return <GlossLine>{intersperse(segmentDivs, <div>-</div>)}</GlossLine>
}
const intersperse = (arr, sep) =>
  arr.reduce((a, v) => [...a, v, sep], []).slice(0, -1)

/** One morpheme that can be clicked to see further details. */
const MorphemeSegment = ({ segment, gloss, dialog, onOpenDetails }) => (
  <MorphemeButton {...dialog} onClick={() => onOpenDetails(segment, gloss)}>
    {segment}
  </MorphemeButton>
)

const MorphemeButton = styled(DialogDisclosure)`
  font-family: inherit;
  font-size: inherit;
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
  & > * {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    margin-right: 0;
  }
`

const AnnotatedWord = styled(Group)`
  margin: 16px 24px;
  margin-bottom: 48px;
`
