import type { Meta, StoryObj } from "@storybook/react-vite"
import { fn } from "storybook/test"
import { AudioPlayer } from "./audio-player"

const meta: Meta<typeof AudioPlayer> = {
  title: "Components/AudioPlayer",
  component: AudioPlayer,
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    showProgress: true,
    slices: { start: 0, end: 200 },
    contributor: "John Doe",
    recordedAt: new Date("2023-01-01T12:00:00Z"),
  },
}
