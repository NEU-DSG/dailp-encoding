import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity"
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity"
import { CognitoUser } from "amazon-cognito-identity-js"
import { ChangeEvent, ReactElement, useEffect, useMemo, useState } from "react"
import { MdRecordVoiceOver, MdUploadFile } from "react-icons/md/index"
import { VisuallyHidden } from "reakit"
import { v4 } from "uuid"
import { useUser } from "./auth"
import { AudioPlayer, CleanButton } from "./components"
import { IconTextButton } from "./components/button"
import * as Dailp from "./graphql/dailp"
import { WordAudio } from "./panel-layout"
import { withClass } from "./style/utils"
import { MediaPermissionStatus, useMediaRecorder } from "./use-media-recorder"

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
