import type { Meta, StoryObj } from "@storybook/react-vite"
import React from "react"
import { RiRecordCircleFill } from "react-icons/ri/index"
import { AudioPlayer } from "src/components"
import { IconTextButton } from "src/components/button/button"
import { SubtleButton } from "src/components/subtle-button/subtle-button"
import { subtleButton } from "src/components/subtle-button/subtle-button.css"
import { ContributeAudioSection } from "./contribute-audio-section"
import { contributeAudioOptions } from "./contribute-audio-section.css"

const MockIdleRecorder = ({
  uploadAudio,
}: {
  uploadAudio: (blob: Blob) => Promise<boolean>
}) => (
  <IconTextButton
    icon={<RiRecordCircleFill color={"#EB606E"} />}
    onClick={() => uploadAudio(new Blob(["test"], { type: "audio/wav" }))}
    className={subtleButton}
  >
    Start recording
  </IconTextButton>
)

const MockRecordedRecorder = ({
  uploadAudio,
}: {
  uploadAudio: (blob: Blob) => Promise<boolean>
}) => (
  <div>
    <div className={contributeAudioOptions}>
      <SubtleButton
        onClick={() => uploadAudio(new Blob(["test"], { type: "audio/wav" }))}
      >
        Save audio
      </SubtleButton>
      <SubtleButton onClick={() => {}}>Delete recording</SubtleButton>
    </div>
    <AudioPlayer audioUrl="" showProgress />
  </div>
)

const meta: Meta<typeof ContributeAudioSection> = {
  title: "Documents/ContributeAudioSection",
  component: ContributeAudioSection,
}

export default meta
type Story = StoryObj<typeof meta>

export const Idle: Story = {
  args: {
    Component: MockIdleRecorder,
    processUploadedAudio: async () => true,
  },
}

export const WithRecording: Story = {
  args: {
    Component: MockRecordedRecorder,
    processUploadedAudio: async () => true,
  },
}
