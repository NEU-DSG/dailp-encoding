import React from "react"
import { Disclosure, DisclosureContent, useDisclosureState } from "reakit/Disclosure"
import * as Dailp from "src/graphql/dailp"
import { BasicMorphemeSegment, TagSet, ViewMode } from "./types"
import * as css from "./word-panel.css"
import { FormAudio } from "./audio-player"
import { MorphemicSegmentation } from "./segment"
import { Button } from "reakit/Button"

export interface wordPanelDetails {
    currContents: Dailp.FormFieldsFragment | null
    setCurrContents: (currContents: Dailp.FormFieldsFragment | null) => void
}

export const WordPanel = (
    p : {
        segment : Dailp.FormFieldsFragment | null
        setContent : (content: Dailp.FormFieldsFragment | null) => void
        viewMode : ViewMode
        onOpenDetails: (morpheme: BasicMorphemeSegment) => void
        tagSet: TagSet
    }
) => {
    if (p.segment) {
        const disclosure = useDisclosureState({ visible: true });
        const translation = p.segment.englishGloss.join(", ")
        return (
            <div className={css.wholePanel}>
                
                <div 
                className={css.wordPanelContent}>
                    <Button className={css.wordPanelButton} onClick={() => p.setContent(null)}>X</Button>

                    <h2>{p.segment.source}</h2> 
                    {p.segment.simplePhonetics ? (
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
                    ) : (
                    (p.segment.audioTrack && (
                        <div className={css.audioContainer}>
                        <FormAudio
                            endTime={p.segment.audioTrack.endTime}
                            index={p.segment.audioTrack.index}
                            parentTrack=""
                            resourceUrl={p.segment.audioTrack.resourceUrl}
                            startTime={p.segment.audioTrack.startTime}
                        />
                        </div>
                    )) || (
                        <>
                        <br />
                        <br />
                        </>
                    )
                    )}

                    {<MorphemicSegmentation
                            segments={p.segment.segments}
                            onOpenDetails={p.onOpenDetails}
                            level={p.viewMode}
                            tagSet={p.tagSet}
                        />}
                    {translation.length ? <div>&lsquo;{translation}&rsquo;</div> : <br />}
                </div>
            </div>
        )
    }
    else {
        return (
            <p>No word has been selected</p>
        )
    }
    
}
