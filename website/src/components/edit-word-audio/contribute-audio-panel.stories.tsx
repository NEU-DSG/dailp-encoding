import type { Meta, StoryObj } from "@storybook/react-vite"
import React from "react"
import { RiMicFill } from "react-icons/ri/index"
import { createClient, Provider } from "urql"
import { never } from "wonka"
import { AudioPlayer } from "src/components"
import { IconTextButton } from "src/components/button/button"
import { SubtleButton } from "src/components/subtle-button/subtle-button"
import { subtleButton } from "src/components/subtle-button/subtle-button.css"
import { contributeAudioOptions } from "src/components/contribute-audio-section/contribute-audio-section.css"
import { ContributeAudioPanel } from "./contribute-audio-panel"

function createMockUrqlClient() {
  const client = createClient({ url: "http://localhost/graphql", exchanges: [] })
  client.executeQuery = (() => never) as any
  client.executeMutation = (() => never) as any
  client.executeSubscription = (() => never) as any
  return client
}

const MockIdleRecorder = ({
  uploadAudio,
}: {
  uploadAudio: (blob: Blob) => Promise<boolean>
}) => (
  <IconTextButton
    icon={<RiMicFill color={"#EB606E"} />}
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

const mockWord = {
  __typename: "AnnotatedForm" as const,
  id: "word-001",
  index: 0,
  source: "ᎧᎦᎵ",
  romanizedSource: null,
  phonemic: null,
  englishGloss: ["February"],
  commentary: null,
  segments: [],
  ingestedAudioTrack: null,
  editedAudio: [],
  userContributedAudio: [],
} as any

const meta: Meta<typeof ContributeAudioPanel> = {
  title: "Documents/ContributeAudioPanel",
  component: ContributeAudioPanel,
  decorators: [
    (Story: React.FC) => (
      <Provider value={createMockUrqlClient()}>
        <Story />
      </Provider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Idle: Story = {
  args: {
    panelTitle: "Contribute Audio",
    Icon: RiMicFill,
    Component: MockIdleRecorder,
    word: mockWord,
  },
}

export const WithRecording: Story = {
  args: {
    panelTitle: "Contribute Audio",
    Icon: RiMicFill,
    Component: MockRecordedRecorder,
    word: mockWord,
  },
}
