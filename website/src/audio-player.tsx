import cx from "classnames"
import { Howl } from "howler"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { FiLoader } from "react-icons/fi"
import { MdPauseCircleOutline, MdPlayCircleOutline } from "react-icons/md"
import * as Dailp from "src/graphql/dailp"
import { hideOnPrint } from "src/sprinkles.css"
import * as css from "./audio-player.css"

const segmentClass = cx(hideOnPrint, css.audioElement)
export const SegmentAudio = (props: { audioUrl: string }) => {
  return (
    <span className={segmentClass}>
      <AudioWrapper audioUrl={props.audioUrl} />
    </span>
  )
}

export const FormAudio = (
  props: Dailp.AudioSlice & { howl?: Howl; showProgress?: boolean }
) => {
  return (
    <span>
      <AudioWrapper
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
      <AudioWrapper audioUrl={props.audioUrl} showProgress />
    </div>
  )
}

interface Props {
  audioUrl: string
  showProgress?: boolean
  slices?: { start: number; end: number }
}

const AudioWrapper = (props: Props) => {
  if (typeof window !== "undefined") {
    return (
      <AudioComponent
        audioUrl={props.audioUrl}
        showProgress={props.showProgress}
        slices={props.slices}
      />
    )
  } else {
    return null
  }
}

const AudioComponent = (props: Props) => {
  const audio = useMemo(
    () => new Audio(props.audioUrl),
    [props.audioUrl, props.slices]
  )

  const [progress, setProgress] = useState(0)
  const [loadStatus, setLoadStatus] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(audio.currentTime)
    }, 100)
    return () => clearInterval(interval)
  }, [audio])

  const [start, end] = props.slices
    ? [props.slices.start / 1000, props.slices.end / 1000]
    : [0, audio.duration]

  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (isPlaying) {
      audio.play()
    } else {
      audio.pause()
    }
  }, [isPlaying])

  const setPlayStart = () => {
    audio.currentTime = props.slices
      ? (audio.currentTime = props.slices.start / 1000)
      : 0
  }

  audio.oncanplaythrough = () => {
    setLoadStatus(true)
  }

  useEffect(() => {
    setPlayStart()
  }, [props.slices])

  useEffect(() => {
    if (progress >= end) {
      setIsPlaying(false)
      setPlayStart()
    }
  }, [progress, end])

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
        style={{ width: `${progPtr}%` }}
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
