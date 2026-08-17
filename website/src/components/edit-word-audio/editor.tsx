import { FormEvent, useState } from "react"
import { useUserId } from "src/auth"
import { AudioPlayer } from "../"
import * as Dailp from "../../graphql/dailp"

type AudioTrack = Dailp.AudioSliceFieldsFragment

// Return tuple array of audios filtering by published and unpublished
function splitAudioByStatus(word: Dailp.FormFieldsFragment) {
  const allAudio: AudioTrack[] = [
    ...(word.ingestedAudioTrack ? [word.ingestedAudioTrack] : []),
    ...word.userContributedAudio,
  ]

  return {
    published: allAudio.filter((a) => a.includeInEditedCollection),
    unpublished: allAudio.filter((a) => !a.includeInEditedCollection),
  }
}

// Warpper of an audio track to include a prop if editing to chose to display
// the show to readers button
function AudioTrackRow(p: {
  wordId: string
  audio: AudioTrack
  editable: boolean
}) {
  const contributor = p.audio.recordedBy?.displayName
  const recordedAt = p.audio.recordedAt
    ? new Date(p.audio.recordedAt.formattedDate)
    : undefined

  if (p.editable)
    return (
      <WordAudioWithCurate
        wordId={p.wordId}
        audio={p.audio}
        contributor={contributor}
        recordedAt={recordedAt}
      />
    )

  return (
    <AudioPlayer
      audioUrl={p.audio.resourceUrl}
      contributor={contributor}
      recordedAt={recordedAt}
      slices={
        p.audio.startTime && p.audio.endTime
          ? { start: p.audio.startTime, end: p.audio.endTime }
          : undefined
      }
      showProgress
    />
  )
}

// Displays published audios, separating by your contributions vs other contributions
export function EditorPublishedWordAudio(p: {
  word: Dailp.FormFieldsFragment
  editable: boolean
}) {
  const userId = useUserId()
  const { published } = splitAudioByStatus(p.word)

  if (published.length === 0)
    return <div>No audio available for this word.</div>

  const ownPublishedAudios = published.filter(
    (a) => a.recordedBy?.id === userId
  )

  const otherPublishedAudios = published.filter(
    (a) => a.recordedBy?.id !== userId
  )

  return (
    <div>
      {ownPublishedAudios.length > 0 && (
        <>
          <strong>Your Published Audio</strong>
          {ownPublishedAudios.map((audio) => (
            <AudioTrackRow
              key={audio.sliceId}
              wordId={p.word.id}
              audio={audio}
              editable={p.editable}
            />
          ))}
        </>
      )}
      {otherPublishedAudios.length > 0 && (
        <>
          {otherPublishedAudios.length > 0 && <hr />}
          <strong>Other Published Contributions</strong>
          {otherPublishedAudios.map((audio) => (
            <AudioTrackRow
              key={audio.sliceId}
              wordId={p.word.id}
              audio={audio}
              editable={p.editable}
            />
          ))}
        </>
      )}
    </div>
  )
}

// Displays unpublished audios, separating by your contributions vs other contributions
export function EditorUnpublishedWordAudio(p: {
  word: Dailp.FormFieldsFragment
  editable: boolean
}) {
  const userId = useUserId()
  const { unpublished } = splitAudioByStatus(p.word)

  if (unpublished.length === 0)
    return <div>No unpublished audio for this word.</div>

  const ownUnpublishedAudios = unpublished.filter(
    (a) => a.recordedBy?.id === userId
  )
  const otherUnpublishedAudios = unpublished.filter(
    (a) => a.recordedBy?.id !== userId
  )

  return (
    <div>
      {ownUnpublishedAudios.length > 0 && (
        <>
          <strong>Your Unpublished Contributions</strong>
          <ul style={{ margin: 0, padding: 0 }}>
            {ownUnpublishedAudios.map((audio) => (
              <AudioTrackRow
                key={audio.sliceId}
                wordId={p.word.id}
                audio={audio}
                editable={p.editable}
              />
            ))}
          </ul>
        </>
      )}
      {otherUnpublishedAudios.length > 0 && (
        <>
          {otherUnpublishedAudios.length > 0 && <hr />}
          <strong>Other Unpublished Contributions</strong>
          <ul style={{ margin: 0, padding: 0 }}>
            {otherUnpublishedAudios.map((audio) => (
              <AudioTrackRow
                key={audio.sliceId}
                wordId={p.word.id}
                audio={audio}
                editable={p.editable}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export function WordAudioWithCurate({
  wordId,
  audio,
  contributor,
  recordedAt,
}: {
  wordId: string
  audio: Dailp.AudioSliceFieldsFragment
  contributor: string | undefined
  recordedAt: Date | undefined
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
          contributor={contributor}
          recordedAt={recordedAt}
          slices={
            audio.startTime && audio.endTime
              ? { start: audio.startTime, end: audio.endTime }
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
  contributor,
  recordedAt,
  documentId,
  audio,
}: {
  documentId: string
  contributor: string | undefined
  recordedAt: Date | undefined
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
    <div style={{ display: "flex", flex: 1 }}>
      <div style={{ flex: 1 }}>
        <AudioPlayer
          contributor={contributor}
          recordedAt={recordedAt}
          audioUrl={audio.resourceUrl}
          slices={
            audio.startTime && audio.endTime
              ? { start: audio.startTime, end: audio.endTime }
              : undefined
          }
          showProgress
          style={{ width: "100%" }}
        />
      </div>
      <div style={{ flex: 0, width: "max-content" }}>
        <label>
          Show to readers?
          <input type="checkbox" checked={checked} onChange={onChange} />
        </label>
      </div>
    </div>
  )
}
