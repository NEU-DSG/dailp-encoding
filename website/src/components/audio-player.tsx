import React, { useEffect, useMemo, useState } from "react"
import { FiLoader } from "react-icons/fi/index"
import { MdPauseCircleOutline, MdPlayCircleOutline } from "react-icons/md/index"
import * as css from "./audio-player.css"

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
  audioUrl: string
  showProgress?: boolean
  slices?: { start: number; end: number }
  style?: any
  contributorName?: string
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
  const audio = useMemo(() => new Audio(props.audioUrl), [props.audioUrl])

  const [progress, setProgress] = useState(0)
  const [loadStatus, setLoadStatus] = useState(getDefaultLoadStatus())
  const [isPlaying, setIsPlaying] = useState(false)

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

  return (
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
      {props.contributorName && (
        <span className="audio-contributor-name">{props.contributorName}</span>
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
