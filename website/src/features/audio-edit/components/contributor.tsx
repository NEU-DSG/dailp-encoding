import { Fragment } from "react"
import { useUserId } from "src/auth"
import { WordAudio } from "src/features/documents/components/word-panel"
import { AudioPlayer } from "src/ui"
import * as Dailp from "src/graphql/dailp"
import { RecordAudioPanel } from "./record"

function AvailableAudioSection(p: { word: Dailp.FormFieldsFragment }) {
  const userId = useUserId()

  const curatedAudioContent = p.word.editedAudio.length > 0 && (
    <>
      <strong>Curated audio (shown to all readers)</strong>
      <WordAudio word={p.word} />
    </>
  )

  const [audioByUser, audioByOthers] = p.word.userContributedAudio.reduce<
    [
      Dailp.FormFieldsFragment["userContributedAudio"],
      Dailp.FormFieldsFragment["userContributedAudio"]
    ]
  >(
    ([self, other], audio) =>
      audio.recordedBy?.id === userId
        ? [[...self, audio], other]
        : [self, [...other, audio]],
    [[], []]
  )

  const userAudioContent = audioByUser.length > 0 && (
    <>
      <strong>Audio you've contributed</strong>
      {audioByUser.map((audio) => (
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
      ))}
    </>
  )

  const otherUserAudioContent = audioByOthers.length > 0 && (
    <>
      <strong>Audio from other speakers</strong>
      {audioByOthers.map((audio) => (
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
      ))}
    </>
  )

  const content = [curatedAudioContent, userAudioContent, otherUserAudioContent]
    .filter((content) => content !== false)
    .map((content, idx) => (
      <Fragment key={idx}>
        {idx > 0 && <hr />}
        {content}
      </Fragment>
    ))

  return (
    <>{content.length > 0 ? content : "No audio available for this word."}</>
  )
}

export function ContributorEditWordAudio(p: {
  word: Dailp.FormFieldsFragment
}) {
  return (
    <div>
      <AvailableAudioSection word={p.word} />
    </div>
  )
}
