import { Tooltip } from "@reach/tooltip"
import "@reach/tooltip/styles.css"
import cx from "classnames"
import { Howl } from "howler"
import { flatMap } from "lodash"
import React from "react"
import {
  MdHearing,
  MdPauseCircleOutline,
  MdPlayCircleOutline,
} from "react-icons/md"
import { DialogDisclosure, DialogStateReturn } from "reakit/Dialog"
import * as Dailp from "src/graphql/dailp"
import { hideOnPrint } from "src/sprinkles.css"
import * as css from "./audio-player.css"
import {
  BasicMorphemeSegment,
  TagSet,
  ViewMode,
  morphemeDisplayTag,
} from "./types"

const segmentClass = cx(hideOnPrint, css.audioElement)
export const SegmentAudio = (props: { audioUrl: string }) => {
  return (
    <span className={segmentClass}>
      <AudioPlayer audioUrl={props.audioUrl} />
    </span>
  )
}

export const FormAudio = (props: Dailp.AudioSlice & { howl?: Howl }) => {
  return (
    <span>
      <AudioPlayer
        audioUrl={props.resourceUrl}
        slices={{ start: props.startTime, end: props.endTime }}
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

class AudioPlayer extends React.Component<
  {
    audioUrl: string
    showProgress?: boolean
    preload?: boolean
    slices?: { start: number; end: number }
    existingHowl?: Howl
  },
  { progress: number; howl: Howl }
> {
  constructor(props) {
    super(props)
    // let slices = this.props.slices && {
    //   ...this.props.slices.map((a) => {this.props.slices.indexOf(a)}), ...this.props.slices
    // }
    this.state = {
      progress: 0,
      howl: new Howl({
        src: [this.props.audioUrl],
        html5: true,
        format: ".wav",
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

  render() {
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

const PauseButton = (props: { howl: Howl }) => {
  return <MdPauseCircleOutline onClick={() => props.howl.pause()} />
}

const PlayButton = (props: { howl: Howl; isSprite?: boolean }) => {
  return props.isSprite ? (
    <MdPlayCircleOutline onClick={() => props.howl.play("sound")} />
  ) : (
    <MdPlayCircleOutline onClick={() => props.howl.play()} />
  )
}
// TODO: Implement Seek
// TODO: Implement start and end times
const ProgressBar = (props: {
  progress: number
  seek: (n: number) => void
}) => {
  return (
    <div
      className={css.container}
      onClick={() => {
        props.seek(3)
      }}
    >
      <div
        className={css.fill}
        style={{ width: `${props.progress}%` }}
        onDrag={() => {}}
      />
      {/*<div css={timestamp}>*/}
      {/*  <span></span>*/}
      {/*  <span></span>*/}
      {/*</div>*/}
    </div>
  )
}
