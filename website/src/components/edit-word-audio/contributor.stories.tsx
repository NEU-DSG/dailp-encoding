import type { Meta, StoryObj } from "@storybook/react-vite"
import { ContributorEditWordAudio } from "./contributor"

const mockWordNoAudio = {
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

const mockAudioSlice = (id: string, url: string) => ({
  __typename: "AudioSlice" as const,
  sliceId: id,
  index: 0,
  resourceUrl: url,
  startTime: null,
  endTime: null,
  includeInEditedCollection: false,
  recordedBy: { __typename: "User" as const, id: "user-001", displayName: "User1" },
  recordedAt: { __typename: "Date" as const, formattedDate: "March 15, 2024" },
})

const mockWordWithAudio = {
  ...mockWordNoAudio,
  editedAudio: [mockAudioSlice("slice-001", "https://www.w3schools.com/html/horse.mp3")],
  userContributedAudio: [
    mockAudioSlice("slice-002", "https://www.w3schools.com/html/horse.mp3"),
    mockAudioSlice("slice-003", "https://www.w3schools.com/html/horse.mp3"),
  ],
}

const meta: Meta<typeof ContributorEditWordAudio> = {
  title: "Documents/ContributorEditWordAudio",
  component: ContributorEditWordAudio,
}

export default meta
type Story = StoryObj<typeof meta>

export const NoAudio: Story = {
  args: { word: mockWordNoAudio },
}

export const WithAudio: Story = {
  args: { word: mockWordWithAudio },
}
