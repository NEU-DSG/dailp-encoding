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
      <AudioComponent audioUrl={props.audioUrl} />
    </span>
  )
}

export const FormAudio = (
  props: Dailp.AudioSlice & { howl?: Howl; showProgress?: boolean }
) => {
  return (
    <span>
      {/**
       * <FunctionalAudioPlayer
        audioUrl={props.resourceUrl}
        showProgress={!!props.showProgress}
        slices={{ start: props.startTime!, end: props.endTime! }}
        preload={true}
      />
       * 
       */}
      <AudioComponent
        audioUrl={props.resourceUrl}
        slices={{ start: props.startTime!, end: props.endTime! }}
      />
    </span>
  )
}

export const DocumentAudio = (props: { audioUrl: string }) => {
  return (
    <div className={css.wide}>
      <span>Document Audio:</span>
      <AudioComponent audioUrl={props.audioUrl} preload showProgress />
    </div>
  )
}

interface Props {
  audioUrl: string
  showProgress?: boolean
  preload?: boolean
  slices?: { start: number; end: number }
  existingHowl?: Howl
}

const AudioComponent = (props: Props) => {
  const audio = useRef(new Audio(props.audioUrl))

  const [progress, setProgress] = useState(0)
  const [loadStatus, setLoadStatus] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(audio.current.currentTime)
      setLoadStatus(audio.current.readyState)
    }, 100)
    return () => clearInterval(interval)
  }, [])

  const [start, end] = props.slices
    ? [props.slices.start / 1000, props.slices.end / 1000]
    : [0, audio.current.duration]

  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (isPlaying) {
      audio.current.play()
      console.log("bruh")
    } else {
      audio.current.pause()
    }
  }, [isPlaying])

  const setPlayStart = () => {
    audio.current.currentTime = props.slices
      ? (audio.current.currentTime = props.slices.start / 1000)
      : 0
  }

  useEffect(() => {
    setPlayStart()
  }, [props.slices])

  useEffect(() => {
    if (progress >= end) {
      setIsPlaying(false)
      setPlayStart()
    }
  }, [progress])

  return (
    <div className="audio-controls">
      {loadStatus >= audio.current.HAVE_FUTURE_DATA ? (
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
      <ProgressBar progress={progress} bounds={{ start, end }} />
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
