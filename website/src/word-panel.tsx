import React from "react"
import { MdClose } from "react-icons/md"
import { Button } from "reakit/Button"
import {
  Disclosure,
  DisclosureContent,
  useDisclosureState,
} from "reakit/Disclosure"
import * as Dailp from "src/graphql/dailp"
import { FormAudio } from "./audio-player"
import { MorphemicSegmentation } from "./segment"
import { BasicMorphemeSegment, TagSet, ViewMode } from "./types"
import * as css from "./word-panel.css"

export interface WordPanelDetails {
  currContents: Dailp.FormFieldsFragment | null
  setCurrContents: (currContents: Dailp.FormFieldsFragment | null) => void
}

export const WordPanel = (p: {
  segment: Dailp.FormFieldsFragment | null
  setContent: (content: Dailp.FormFieldsFragment | null) => void
  viewMode: ViewMode
  onOpenDetails: (morpheme: BasicMorphemeSegment) => void
  tagSet: TagSet
}) => {
  if (p.segment) {
    const translation = p.segment.englishGloss.join(", ")
    let phonetics = (
      <>
        <br />
        <br />
      </>
    )
    if (p.segment.simplePhonetics) {
      phonetics = (
        <>
          <div>{p.segment.romanizedSource}</div>
          <div>
            {p.segment.simplePhonetics}
            {p.segment.audioTrack && (
              <FormAudio
                endTime={p.segment.audioTrack.endTime}
                index={p.segment.audioTrack.index}
                parentTrack=""
                resourceUrl={p.segment.audioTrack.resourceUrl}
                startTime={p.segment.audioTrack.startTime}
              />
            )}
          </div>
        </>
      )
    } else if (p.segment.audioTrack) {
      phonetics = (
        <div className={css.audioContainer}>
          <FormAudio
            endTime={p.segment.audioTrack.endTime}
            index={p.segment.audioTrack.index}
            parentTrack=""
            resourceUrl={p.segment.audioTrack.resourceUrl}
            startTime={p.segment.audioTrack.startTime}
          />
        </div>
      )
    }

    return (
      <div className={css.wholePanel}>
        <div className={css.wordPanelContent}>
          <Button
            className={css.wordPanelButton}
            onClick={() => p.setContent(null)}
            aria-label="Close Word Details"
          >
            <MdClose size={32} />
          </Button>
          <h2>Selected word:</h2>
          <h1>{p.segment.source}</h1>
          {phonetics}
          {
            <MorphemicSegmentation
              segments={p.segment.segments}
              onOpenDetails={p.onOpenDetails}
              level={p.viewMode}
              tagSet={p.tagSet}
            />
          }
          {translation.length ? <div>&lsquo;{translation}&rsquo;</div> : <br />}
        </div>
      </div>
    )
  } else {
    return <p>No word has been selected</p>
  }
}
