import type { Meta, StoryObj } from "@storybook/react-vite"
import { fn } from "storybook/test"
import { AudioPlayer } from "./audio-player"

const meta: Meta<typeof AudioPlayer> = {
  title: "Components/AudioPlayer",
  component: AudioPlayer,
}

export default meta
type Story = StoryObj<typeof meta>

export const Example1: Story = {
  args: {
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    showProgress: true,
    slices: { start: 0},
    contributor: "John Doe",
    recordedAt: new Date("2023-01-01T12:00:00Z"),
  },
}

export const Example2: Story = {
  args: {
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    showProgress: true,
    slices: { start: 10, end: 50 },
    contributor: "John Doe 2",
    recordedAt: new Date("2025-01-01T12:00:00Z"),
  },
}
