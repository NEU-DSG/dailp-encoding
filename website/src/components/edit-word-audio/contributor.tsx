import { Fragment, ReactNode } from "react"
import { useUserId } from "src/auth"
import { WordAudio } from "src/word-panel"
import { AudioPlayer } from "../"
import * as Dailp from "../../graphql/dailp"

type ContributedAudioTrack =
  Dailp.FormFieldsFragment["userContributedAudio"][number]

function renderTrack(audio: ContributedAudioTrack) {
  return (
    <AudioPlayer
      key={audio.sliceId}
      audioUrl={audio.resourceUrl}
      contributor={audio.recordedBy?.displayName}
      recordedAt={
        audio.recordedAt ? new Date(audio.recordedAt.formattedDate) : undefined
      }
      slices={
        audio.startTime && audio.endTime
          ? { start: audio.startTime, end: audio.endTime }
          : undefined
      }
      showProgress
    />
  )
}

function AvailableAudioSection(p: { word: Dailp.FormFieldsFragment }) {
  const userId = useUserId()

  // Remove own contributions to render separately
  const wordWithoutOwnContributions: Dailp.FormFieldsFragment = {
    ...p.word,
    editedAudio: p.word.editedAudio.filter(
      (audio) => audio.recordedBy?.id !== userId
    ),
  }
  const hasOtherPublishedAudio =
    wordWithoutOwnContributions.editedAudio.length > 0

  const ownPublishedContributions = p.word.userContributedAudio.filter(
    (audio) =>
      audio.recordedBy?.id === userId && audio.includeInEditedCollection
  )

  const sections: { label: string; content: ReactNode }[] = []

  if (hasOtherPublishedAudio) {
    sections.push({
      label: "Published Audio",
      content: <WordAudio word={wordWithoutOwnContributions} />,
    })
  }

  if (ownPublishedContributions.length > 0) {
    sections.push({
      label: "Your Published Contributions",
      content: ownPublishedContributions.map(renderTrack),
    })
  }

  if (sections.length === 0) {
    return <>No audio available for this word.</>
  }

  return (
    <>
      {sections.map((section, idx) => (
        <Fragment key={section.label}>
          {idx > 0 && <hr />}
          <strong>{section.label}</strong>
          {section.content}
        </Fragment>
      ))}
    </>
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

export function ContributorUnpublishedWordAudio(p: {
  word: Dailp.FormFieldsFragment
}) {
  const userId = useUserId()

  const ownUnpublishedAudios = p.word.userContributedAudio.filter(
    (audio) =>
      audio.recordedBy?.id === userId && !audio.includeInEditedCollection
  )

  if (ownUnpublishedAudios.length === 0) {
    return <div>You have no unpublished audios for this word.</div>
  }

  return <div>{ownUnpublishedAudios.map(renderTrack)}</div>
}
