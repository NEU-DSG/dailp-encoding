import React from "react"
import {css} from "@emotion/react"
import {DialogDisclosure, DialogStateReturn} from "reakit/Dialog"
import {Tooltip} from "@reach/tooltip"
import {MdHearing, MdPauseCircleOutline, MdPlayCircleOutline} from "react-icons/md"
import {flatMap} from "lodash"
import {BasicMorphemeSegment, morphemeDisplayTag, TagSet, ViewMode} from "./types"
import theme, {hideOnPrint, std, typography, } from "./theme"
import "@reach/tooltip/styles.css"
import {Howl} from 'howler';


export const SegmentAudio = (props: {audioUrl: string}) => {
  return (
    <span css={[hideOnPrint, audioElement]}>
      <AudioPlayer audioUrl={props.audioUrl}/>
    </span>
  )
}

export const FormAudio = (props: GatsbyTypes.Dailp_AudioSlice & {howl?: Howl}) => {
  return(
    <span>
      <AudioPlayer audioUrl={props.resourceUrl} slices={{start: props.startTime, end: props.endTime}}/>
    </span>
  )
}

export const DocumentAudio = (props: {audioUrl: string}) => {
   return(
      <div css={css`width: 100%;`}>
        <span>Document Audio:</span>
        <AudioPlayer audioUrl={props.audioUrl} preload showProgress/>
      </div>
   )
}

class AudioPlayer extends React.Component<
  {audioUrl: string, showProgress?: boolean, preload?: boolean, slices?: { start: number, end: number }, existingHowl?: Howl},
  {progress: number, howl: Howl}> {
  constructor(props) {
    super(props)
    // let slices = this.props.slices && {
    //   ...this.props.slices.map((a) => {this.props.slices.indexOf(a)}), ...this.props.slices
    // }
    this.state = {
      progress: 0,
      howl:
        new Howl({
          src: [this.props.audioUrl],
          html5: true,
          format: ".wav",
          preload: this.props.preload || false,
          onplay: () => {this.onPlay()}, // What happens when a sound starts playing?
          onend: () => {}, // What happens when a sound finishes playing?
          onpause: () => {}, // What happens when a sound is paused?
          onseek: () => {}, // What happens when a sound seeks?
        }
      ),
    }
    if (this.props.slices) {
      let slices =
        {__default: [
            this.props.slices.start,
            this.props.slices.end - this.props.slices.start
          ],
          sound: [
            this.props.slices.start,
            this.props.slices.end - this.props.slices.start
          ]}
      Object.assign(this.state.howl, {'_sprite': slices})
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
      progress: ((seek / this.state.howl.duration()) * 100),
    }));
    if (this.state.howl.playing()) {
      requestAnimationFrame(this.nextStep);
    }
  }

  onSeek(newProgress: number) {
    this.setState((prevState, props) => ({
      progress: newProgress,
    }));
    this.state.howl.seek((newProgress / 100) * this.state.howl.duration())
  }

  render() {
    let button;
    let progress = this.state.progress;

    if (progress > 0 && progress < 100 && this.state.howl.playing())
      button = <PauseButton howl={this.state.howl}/>
    else button = <PlayButton howl={this.state.howl} isSprite={!!this.props.slices}/>

    // Conditionally hide the bar
    return (
      <div css={audioElement}>
        {button}
        {this.props.showProgress
        && <ProgressBar progress={this.state.progress} seek={this.onSeek}/>}
      </div>
    )
  }
}

const PauseButton = (props: {howl: Howl}) => {
  return (
      <MdPauseCircleOutline onClick={() => props.howl.pause()} />
  )
}

const PlayButton = (props: {howl: Howl, isSprite?:boolean}) => {
  return (
    (props.isSprite) ?
      <MdPlayCircleOutline onClick={() => props.howl.play('sound')}/> :
      <MdPlayCircleOutline onClick={() => props.howl.play()}/>
  )
}
// TODO: Implement Seek
// TODO: Implement start and end times
const ProgressBar = (props: {progress: number, seek: (n: number) => void}) => {
  const containerStyle = css`
    height: 0.2em;
    width: 75% !important;
    background: #a9a9a9;
    border-radius: 0.2em;
    margin: 0.4em;
    display: inline-block;
  `
  const fillStyle = css`
    height: 100%;
    width: ${props.progress}%;
    background: #444444;
    border-radius: inherit;
    text-align: right;
  `

  return (
    <div css={containerStyle} onClick={() => {props.seek(3)}}>
      <div css={fillStyle} onDrag={() => {}}/>
      {/*<div css={timestamp}>*/}
      {/*  <span></span>*/}
      {/*  <span></span>*/}
      {/*</div>*/}
    </div>
  )
}

const audioElement = css`
  margin-left: 0.4rem;
  cursor: pointer;
  display: inline;
  text-align: center;
  width: 100% !important;
  svg {
    fill: ${theme.colors.link};
  }
`

const timestamp = css`
  //margin-left: 0.4rem;
  //cursor: pointer;
  display: inline;
  text-align: center;
  //width: 100% !important;
  text-color: ${theme.colors.link};
  }
`

