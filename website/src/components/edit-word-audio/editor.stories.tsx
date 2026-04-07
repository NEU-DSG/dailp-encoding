import type { Meta, StoryObj } from "@storybook/react-vite"
import React from "react"
import { createClient, Provider } from "urql"
import { never } from "wonka"
import { EditorEditWordAudio } from "./editor"

function createMockUrqlClient() {
  const client = createClient({ url: "http://localhost/graphql", exchanges: [] })
  client.executeQuery = (() => never) as any
  client.executeMutation = (() => never) as any
  client.executeSubscription = (() => never) as any
  return client
}

const mockAudioSlice = (id: string, opts: {
  contributor: { id: string; displayName: string } | null
  formattedDate: string | null
  includeInEditedCollection: boolean
}) => ({
  __typename: "AudioSlice" as const,
  sliceId: id,
  index: 0,
  resourceUrl: "https://www.w3schools.com/html/horse.mp3",
  startTime: null,
  endTime: null,
  includeInEditedCollection: opts.includeInEditedCollection,
  recordedBy: opts.contributor
    ? { __typename: "User" as const, id: opts.contributor.id, displayName: opts.contributor.displayName }
    : null,
  recordedAt: opts.formattedDate
    ? { __typename: "Date" as const, formattedDate: opts.formattedDate }
    : null,
})

const mockWordBase = {
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
}

const meta: Meta<typeof EditorEditWordAudio> = {
  title: "Documents/EditorEditWordAudio",
  component: EditorEditWordAudio,
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

export const NoAudio: Story = {
  args: {
    word: { ...mockWordBase, userContributedAudio: [] } as any,
  },
}

export const WithNamedContributor: Story = {
  args: {
    word: {
      ...mockWordBase,
      userContributedAudio: [
        mockAudioSlice("slice-001", {
          contributor: { id: "user-001", displayName: "User1" },
          formattedDate: "March 15, 2024",
          includeInEditedCollection: true,
        }),
      ],
    } as any,
  },
}

export const WithUnknownContributor: Story = {
  args: {
    word: {
      ...mockWordBase,
      userContributedAudio: [
        mockAudioSlice("slice-002", {
          contributor: null,
          formattedDate: "April 2, 2024",
          includeInEditedCollection: false,
        }),
      ],
    } as any,
  },
}

export const WithUnknownDate: Story = {
  args: {
    word: {
      ...mockWordBase,
      userContributedAudio: [
        mockAudioSlice("slice-003", {
          contributor: { id: "user-002", displayName: "User2" },
          formattedDate: null,
          includeInEditedCollection: false,
        }),
      ],
    } as any,
  },
}