import { FormEvent } from "react"
import { AudioPlayer } from "../"
import { useState } from "react"
import * as Dailp from "../../graphql/dailp"

export function EditorEditWordAudio(p: { word: Dailp.FormFieldsFragment }) {
  const allAudio = [
    ...(p.word.ingestedAudioTrack ? [p.word.ingestedAudioTrack] : []),
    ...p.word.userContributedAudio,
  ]

  return (
    <div>
      <ul style={{ margin: 0, padding: 0 }}>
        {allAudio.length === 0
          ? "No audio available for this word."
          : allAudio.map((audio) => (
              <WordAudioWithCurate wordId={p.word.id} audio={audio} />
            ))}
      </ul>
    </div>
  )
}

export function WordAudioWithCurate({
  wordId,
  audio,
}: {
  wordId: string
  audio: Dailp.AudioSliceFieldsFragment
}) {
  const [_res, curateWordAudio] = Dailp.useCurateWordAudioMutation()

  function onChange(e: FormEvent<HTMLInputElement>) {
    e.preventDefault()
    curateWordAudio({
      input: {
        wordId,
        audioSliceId: audio.sliceId,
        includeInEditedCollection: !audio.includeInEditedCollection,
      },
    })
  }
  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1 }}>
        <AudioPlayer
          audioUrl={audio.resourceUrl}
          slices={
            audio.startTime && audio.endTime
              ? {
                  start: audio.startTime,
                  end: audio.endTime,
                }
              : undefined
          }
          showProgress
        />
      </div>
      <div style={{ flex: 0, width: "max-content" }}>
        <label>
          Show to readers?
          <input
            type="checkbox"
            checked={audio.includeInEditedCollection}
            onChange={onChange}
          />
        </label>
      </div>
    </div>
  )
}

export function DocumentAudioWithCurate({
  documentId,
  audio,
}: {
  documentId: string
  audio: Dailp.AudioSliceFieldsFragment
}) {
  const [_res, curateDocumentAudio] = Dailp.useCurateDocumentAudioMutation()
  const [checked, setChecked] = useState(audio.includeInEditedCollection)

  function onChange(e: FormEvent<HTMLInputElement>) {
    e.preventDefault()
    setChecked(!checked)
    curateDocumentAudio({
      input: {
        documentId,
        audioSliceId: audio.sliceId,
        includeInEditedCollection: !checked,
      },
    })
  }
  return (
    <div style={{ display: "flex", flex:1 }}>
      <div style={{ flex: 1 }}>
        <AudioPlayer
          audioUrl={audio.resourceUrl}
          slices={
            audio.startTime && audio.endTime
              ? {
                  start: audio.startTime,
                  end: audio.endTime,
                }
              : undefined
          }
          showProgress
          style={{ width: "100%" }}
        />
      </div>
      <div style={{ flex: 0, width: "max-content" }}>
        <label>
          Show to readers?
          <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
          />
        </label>
      </div>
    </div>
  )
}
