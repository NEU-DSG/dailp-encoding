import cx from "classnames"
import { Howl } from "howler"
import React, { useEffect, useState } from "react"
import { MdPauseCircleOutline, MdPlayCircleOutline } from "react-icons/md"
import * as Dailp from "src/graphql/dailp"
import { hideOnPrint } from "src/sprinkles.css"
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
      <FunctionalAudioPlayer
        audioUrl={props.resourceUrl}
        showProgress={!!props.showProgress}
        slices={{ start: props.startTime!, end: props.endTime! }}
        preload
      />
    </span>
  )
}

export const DocumentAudio = (props: { audioUrl: string }) => {
  return (
    <div className={css.wide}>
      <span>Document Audio:</span>
      <AudioPlayer audioUrl={props.audioUrl} preload showProgress />
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
class AudioPlayer extends React.Component<
  Props,
  { progress: number; howl: Howl }
> {
  constructor(props: Props) {
    super(props)
    // let slices = this.props.slices && {
    //   ...this.props.slices.map((a) => {this.props.slices.indexOf(a)}), ...this.props.slices
    // }
    this.state = {
      progress: 0,
      howl: new Howl({
        src: [this.props.audioUrl],
        html5: true,
        format: [".wav"],
        preload: this.props.preload || false,
        onplay: () => {
          this.onPlay()
        }, // What happens when a sound starts playing?
        onend: () => {}, // What happens when a sound finishes playing?
        onpause: () => {}, // What happens when a sound is paused?
        onseek: () => {}, // What happens when a sound seeks?
      }),
    }
    if (this.props.slices) {
      let slices = {
        __default: [
          this.props.slices.start,
          this.props.slices.end - this.props.slices.start,
        ],
        sound: [
          this.props.slices.start,
          this.props.slices.end - this.props.slices.start,
        ],
      }
      Object.assign(this.state.howl, { _sprite: slices })
    }
    // Event handlers
    this.nextStep = this.nextStep.bind(this)
    this.onPlay = this.onPlay.bind(this)
    this.onSeek = this.onSeek.bind(this)
  }

  onPlay() {
    requestAnimationFrame(this.nextStep)
  }

  nextStep() {
    let seek = this.state.howl.seek() || 0
    this.setState((prevState, props) => ({
      progress: (seek / this.state.howl.duration()) * 100,
    }))
    if (this.state.howl.playing()) {
      requestAnimationFrame(this.nextStep)
    }
  }

  onSeek(newProgress: number) {
    this.setState((prevState, props) => ({
      progress: newProgress,
    }))
    this.state.howl.seek((newProgress / 100) * this.state.howl.duration())
  }

  override render() {
    let button
    let progress = this.state.progress

    if (progress > 0 && progress < 100 && this.state.howl.playing())
      button = <PauseButton howl={this.state.howl} />
    else
      button = (
        <PlayButton howl={this.state.howl} isSprite={!!this.props.slices} />
      )

    // Conditionally hide the bar
    return (
      <div className={css.audioElement}>
        {button}
        {this.props.showProgress && (
          <ProgressBar progress={this.state.progress} seek={this.onSeek} />
        )}
      </div>
    )
  }
}

const FunctionalAudioPlayer = (props: Props) => {
  const [progress, setProgress] = useState(0)
  const [howl, setHowl] = useState(
    new Howl({
      src: [props.audioUrl],
      html5: true,
      format: [".wav"],
      preload: props.preload || false,
      onplay: () => {
        onPlay()
      }, // What happens when a sound starts playing?
      onend: () => {}, // What happens when a sound finishes playing?
      onpause: () => {}, // What happens when a sound is paused?
      onseek: () => {}, // What happens when a sound seeks?
    })
  )
  const onPlay = () => {
    requestAnimationFrame(nextStep)
  }
  const nextStep = () => {
    let seek = howl.seek() || 0
    setProgress((seek / howl.duration()) * 100)
    if (howl.playing()) {
      requestAnimationFrame(nextStep)
    }
  }

  if (props.slices) {
    Object.assign(howl, {
      _sprite: {
        __default: [props.slices.start, props.slices.end - props.slices.start],
        sound: [props.slices.start, props.slices.end - props.slices.start],
      },
    })
  }

  const onSeek = (newProgress: number) => {
    setProgress(newProgress)
    howl.seek((newProgress / 100) * howl.duration())
  }

  // Button set up
  let button
  if (progress > 0 && progress < 100 && howl.playing())
    button = <PauseButton howl={howl} />
  else button = <PlayButton howl={howl} isSprite={!!props.slices} />

  const bounds = props.slices
    ? {
        start: props.slices.start / (howl.duration() * 10),
        end: props.slices.end / (howl.duration() * 10),
      }
    : null

  // Finally return call
  // Conditionally hide the bar
  return (
    <div className={css.audioElement}>
      {button}
      {props.showProgress && (
        <ProgressBar progress={progress} seek={onSeek} bounds={bounds} />
      )}
      {howl.state()}
    </div>
  )
}

const buttonSize = 28

const PauseButton = (props: { howl: Howl }) => {
  return (
    <MdPauseCircleOutline
      size={buttonSize}
      onClick={() => props.howl.pause()}
    />
  )
}

const PlayButton = (props: { howl: Howl; isSprite?: boolean }) => {
  return props.isSprite ? (
    <MdPlayCircleOutline
      size={buttonSize}
      onClick={() => props.howl.play("sound")}
    />
  ) : (
    <MdPlayCircleOutline size={buttonSize} onClick={() => props.howl.play()} />
  )
}
// TODO: Implement Seek
// TODO: Implement start and end times
const ProgressBar = (props: {
  progress: number
  seek: (n: number) => void
  bounds?: { start: number; end: number } | null
}) => {
  let progPtr = props.progress
  let onClick = () => {
    props.seek(3)
  }
  if (props.bounds) {
    progPtr = Math.min(
      100,
      (100 * (props.progress - props.bounds.start)) /
        (props.bounds.end - props.bounds.start)
    )
    onClick = () => {} // So word audio doesn't get messed by clicks
  }
  return (
    <div className={css.container} onClick={onClick} aria-label={"container"}>
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
