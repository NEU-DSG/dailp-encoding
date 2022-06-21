import cx from "classnames"
import { Howl } from "howler"
import React, { useEffect, useMemo, useState } from "react"
import { FiLoader } from "react-icons/fi"
import { MdPauseCircleOutline, MdPlayCircleOutline } from "react-icons/md"
import * as Dailp from "src/graphql/dailp"
import { hideOnPrint } from "src/style/utils.css"
import * as css from "./audio-player.css"

const segmentClass = cx(hideOnPrint, css.audioElement)
export const SegmentAudio = (props: { audioUrl: string }) => {
  return (
    <span className={segmentClass}>
      <AudioPlayer audioUrl={props.audioUrl} />
    </span>
  )
}

export const FormAudio = (
  props: Dailp.AudioSlice & { howl?: Howl; showProgress?: boolean }
) => {
  return (
    <span>
      <AudioPlayer
        audioUrl={props.resourceUrl}
        slices={{ start: props.startTime!, end: props.endTime! }}
        showProgress={props.showProgress}
      />
    </span>
  )
}

export const DocumentAudio = (props: { audioUrl: string }) => {
  return (
    <div className={css.wide}>
      <span>Document Audio:</span>
      <AudioPlayer audioUrl={props.audioUrl} showProgress />
    </div>
  )
}

interface Props {
  audioUrl: string
  showProgress?: boolean
  slices?: { start: number; end: number }
}

export const AudioPlayer = (props: Props) => {
  if (typeof window !== "undefined") {
    return <AudioPlayerImpl {...props} />
  } else {
    return null
  }
}

const AudioPlayerImpl = (props: Props) => {
  const audio = useMemo(() => new Audio(props.audioUrl), [props.audioUrl])

  const [progress, setProgress] = useState(0)
  const [loadStatus, setLoadStatus] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const [start, end] = props.slices
    ? [props.slices.start / 1000, props.slices.end / 1000]
    : [0, audio.duration]

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

  return (
    <div className="audio-controls">
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
