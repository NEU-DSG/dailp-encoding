import { AudioPlayer } from "../"
import * as Dailp from "../../graphql/dailp"

export function EditorEditWordAudio(p: { word: Dailp.FormFieldsFragment }) {
  const currentCuratedAudio = null
  return (
    <div>
      {currentCuratedAudio
        ? "Currently curated audio"
        : "No currently curated audio. You can selected audio below"}
      <ul>
        {p.word.userContributedAudio.length === 0
          ? "no audio to curate oop"
          : p.word.userContributedAudio.map((audio) => (
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
      </ul>
    </div>
  )
}
