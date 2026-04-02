import React, { useEffect, useMemo, useState } from "react"
import { isMobile } from "react-device-detect"
import { FiDownload, FiLoader, FiTrash2 } from "react-icons/fi/index"
import { MdPauseCircleOutline, MdPlayCircleOutline } from "react-icons/md/index"
import * as Dailp from "src/graphql/dailp"
import { UserRole, useUser, useUserId, useUserRole } from "../auth"
import { S3Uploader } from "../utils/s3"
import * as css from "./audio-player.css"
import { Button } from "./button"

/**
 * Get our default load status for the audio player.
 * On some user agents, we need to default to "loaded" because audio can never be loaded in the background.
 */
function getDefaultLoadStatus() {
  // TODO: is there a place to store this instead of doing this check everytime?
  // happens at this level because vite will run this server-side and crash sometimes
  // @ts-ignore
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

  if (isIOS && isSafari) {
    console.log("User is on iOS Safari - audio player with behave differently")
    return true
  } else {
    return false
  }
}

interface Props {
  sliceId?: string | null | undefined
  parentId?: string | null | undefined
  sliceType?: "word" | "document" | null
  audioUrl: string
  showProgress?: boolean
  slices?: { start: number; end: number }
  style?: any
  contributor?: string
  contributorId?: string
  recordedAt?: Date
}

export const AudioPlayer = (props: Props) => {
  if (typeof window !== "undefined") {
    console.log(
      "[Naomi] start: " + props.slices?.start + "; end: " + props.slices?.end
    )
    return <AudioPlayerImpl {...props} />
  } else {
    return null
  }
}

const AudioPlayerImpl = (props: Props) => {
  const { user } = useUser()

  const role = useUserRole()
  const userId = useUserId()
  const audio = useMemo(() => new Audio(props.audioUrl), [props.audioUrl])

  const [progress, setProgress] = useState(0)
  const [loadStatus, setLoadStatus] = useState(getDefaultLoadStatus())
  const [isPlaying, setIsPlaying] = useState(false)

  const canDelete =
    role === UserRole.Admin ||
    role === UserRole.Editor ||
    (role === UserRole.Contributor && props.contributorId === userId)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const [, deleteWordAudio] = Dailp.useDeleteWordAudioMutation()
  const [, deleteDocAudio] = Dailp.useDeleteDocumentAudioMutation()

  //　FIXME Issue: Word audio drifts forward and backward for no apparent reason
  // Steps (Todo)
  // - verify [start, end] match incoming data from GQL
  // -
  // Steps (complete)
  //
  const [start, end] = props.slices
    ? [props.slices.start / 1000, props.slices.end / 1000] // this does not
    : [0, audio.duration] // this works fine

  console.log("[Naomi] calculated start: " + start + "; end: " + end)

  const reset = () => {
    audio.currentTime = start
    setIsPlaying(false)
  }

  useEffect(() => {
    reset()
  }, [audio, start, setIsPlaying])

  useEffect(() => {
    setProgress(audio.currentTime)
    if (isPlaying) {
      const interval = setInterval(() => {
        if (audio.currentTime >= end) {
          reset()
        }
        setProgress(audio.currentTime)
      }, 80)
      return () => clearInterval(interval)
    }
    return undefined
  }, [audio, start, end, isPlaying, setIsPlaying])

  useEffect(() => {
    if (isPlaying) {
      audio.play()
    } else {
      audio.pause()
    }
  }, [isPlaying])

  audio.oncanplaythrough = () => {
    setLoadStatus(true)
  }

  useEffect(() => {
    if (isConfirmingDelete) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isConfirmingDelete])

  const handleDelete = async () => {
    if (!props.sliceId || !props.parentId) {
      return
    }
    setIsConfirmingDelete(false)
    try {
      if (props.sliceType === "word" && props.parentId && props.sliceId) {
        await deleteWordAudio({
          input: {
            wordId: props.parentId,
            audioSliceId: props.sliceId,
          },
        })
      } else if (
        props.sliceType === "document" &&
        props.parentId &&
        props.sliceId
      ) {
        await deleteDocAudio({
          input: {
            documentId: props.parentId,
            audioSliceId: props.sliceId,
          },
        })
      }
      console.log("deleted from database")
      if (user) {
        const s3 = new S3Uploader(user)

        const url = new URL(props.audioUrl)
        let key = url.pathname

        if (key.startsWith("/")) {
          key = key.substring(1)
        }

        console.log("Deleting S3 Key:", key)

        await s3.deleteContributorAudio(key)
        console.log("S3 Deletion Successful")
      }
    } catch (err) {
      console.error("Deletion sequence failed:", err)
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        paddingBottom: "10px",
      }}
    >
      {isConfirmingDelete && (
        <div className={css.overlay}>
          <div className={css.confirmationBox}>
            <p className={css.confirmationText}>
              Are you sure you want to delete this audio clip?
            </p>

            <div className={css.modalButtonGroup}>
              <Button onClick={() => setIsConfirmingDelete(false)}>
                Cancel
              </Button>

              <Button
                onClick={handleDelete}
                style={{
                  backgroundColor: "#b72d3b",
                }}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
      {props.contributor && props.recordedAt && (
        <div>
          <span>
            Recorded by{" "}
            {props.contributor.length > 0
              ? props.contributor
              : "Unknown Contributor"}{" "}
            on {props.recordedAt.toLocaleDateString()}
          </span>
        </div>
      )}
      <div className={css.audioElement} style={props.style}>
        {loadStatus ? (
          isPlaying ? (
            <MdPauseCircleOutline
              size={buttonSize}
              onClick={() => setIsPlaying(false)}
              aria-label="Pause"
            />
          ) : (
            <MdPlayCircleOutline
              size={buttonSize}
              onClick={() => setIsPlaying(true)}
              aria-label="Play"
            />
          )
        ) : (
          <FiLoader size={buttonSize} />
        )}

        {props.showProgress ? (
          <ProgressBar progress={progress} bounds={{ start, end }} />
        ) : null}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            alignItems: "center",
            width: props.sliceType === "word" ? "40px" : "120px",
          }}
        >
          {canDelete && props.sliceType && (
            <Button
              className={css.buttonStyle}
              onClick={() => setIsConfirmingDelete(true)}
            >
              <FiTrash2 size={22} />
              {props.sliceType !== "word" ? "Delete" : ""}
            </Button>
          )}

          {!isMobile && props.sliceType && (
            <Button
              onClick={() => (window.location.href = props.audioUrl)}
              className={css.buttonStyle}
            >
              <FiDownload size={22} />
              {props.sliceType !== "word" ? "Download" : ""}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

const buttonSize = 28

const ProgressBar = (props: {
  progress: number
  bounds: { start: number; end: number } | null
}) => {
  const progPtr =
    props.bounds && props.bounds.start != Infinity
      ? Math.min(
          100,
          (100 * (props.progress - props.bounds.start)) /
            (props.bounds.end - props.bounds.start)
        )
      : 0
  return (
    <div className={css.container} aria-label={"container"}>
      <div
        className={css.fill}
        style={{ transform: `scaleX(${progPtr / 100})` }}
        onDrag={() => {}}
        aria-label={"fill"}
      />
      {/*<div css={timestamp}>*/}
      {/*  <span></span>*/}
      {/*  <span></span>*/}
      {/*</div>*/}
    </div>
  )
}
