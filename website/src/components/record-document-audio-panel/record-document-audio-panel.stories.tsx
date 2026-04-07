import type { Meta, StoryObj } from "@storybook/react-vite"
import React from "react"
import { createClient, Provider } from "urql"
import { never } from "wonka"
import { RecordDocumentAudioPanel } from "./record-document-audio-panel"

const dollieDoc = {
  __typename: "AnnotatedDoc" as const,
  id: "doc-001",
  title:
    "Letter to Dollie Duncan on Oklahoma State Penitentiary stationery 1951-02-11",
  slug: "dollie-duncan-02-11-1951",
  isReference: false,
  date: { __typename: "Date" as const, year: "1951" },
  bookmarkedOn: null,
  sources: [
    {
      __typename: "SourceAttribution" as const,
      name: "The Newberry Library",
      link: "https://www.newberry.org/",
    },
  ],
  editedAudio: [],
  userContributedAudio: [],
  translatedPages: [],
  chapters: [],
}

function createMockClient() {
  const client = createClient({ url: "http://localhost/graphql", exchanges: [] })
  client.executeQuery = (() => never) as any
  client.executeMutation = (() => never) as any
  client.executeSubscription = (() => never) as any
  return client
}

const meta: Meta<typeof RecordDocumentAudioPanel> = {
  title: "Documents/RecordDocumentAudioPanel",
  component: RecordDocumentAudioPanel,
  decorators: [
    (Story: React.FC) => (
      <Provider value={createMockClient()}>
        <Story />
      </Provider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    document: dollieDoc as any,
  },
}
