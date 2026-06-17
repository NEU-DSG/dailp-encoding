import type { Meta, StoryObj } from "@storybook/react-vite"
import React from "react"
import { Provider, createClient } from "urql"
import { fromValue, never } from "wonka"
import { BookmarksTab } from "./dashboard"

function mockBookmarkDoc(overrides: {
  id: string
  title: string
  year: string
  path: string[]
}) {
  return {
    __typename: "AnnotatedDoc" as const,
    id: overrides.id,
    title: overrides.title,
    slug: overrides.id,
    isReference: false,
    date: { __typename: "Date" as const, year: overrides.year },
    bookmarkedOn: null,
    sources: [],
    editedAudio: [],
    userContributedAudio: [],
    translatedPages: [
      {
        __typename: "DocumentPage" as const,
        image: {
          __typename: "PageImage" as const,
          url: "https://placehold.co/300x200?text=PageImage#",
        },
      },
    ],
    chapters: [
      {
        __typename: "CollectionChapter" as const,
        id: overrides.path[overrides.path.length - 1],
        path: overrides.path,
      },
    ],
  }
}

function createMockProvider(
  bookmarkedDocuments: ReturnType<typeof mockBookmarkDoc>[]
) {
  const client = createClient({
    url: "http://localhost/graphql",
    exchanges: [],
  })
  client.executeQuery = () =>
    fromValue({
      stale: false,
      hasNext: false,
      data: { bookmarkedDocuments },
    }) as any
  client.executeMutation = (() => never) as any
  client.executeSubscription = (() => never) as any
  return client
}

const meta: Meta<typeof BookmarksTab> = {
  title: "Dashboard/BookmarksTab",
  component: BookmarksTab,
}

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  decorators: [
    (Story: React.FC) => (
      <Provider value={createMockProvider([])}>
        <Story />
      </Provider>
    ),
  ],
}

export const OneEntry: Story = {
  decorators: [
    (Story: React.FC) => (
      <Provider
        value={createMockProvider([
          mockBookmarkDoc({
            id: "1",
            title:
              "Letter to Dollie Duncan on Oklahoma State Penitentiary stationery 1951-02-11 (1951)",
            year: "1951",
            path: ["cwkw", "dollie-duncan-02-11-1951"],
          }),
        ])}
      >
        <Story />
      </Provider>
    ),
  ],
}

export const TwoEntries: Story = {
  decorators: [
    (Story: React.FC) => (
      <Provider
        value={createMockProvider([
          mockBookmarkDoc({
            id: "1",
            title:
              "Letter to Dollie Duncan on Oklahoma State Penitentiary stationery 1951-02-11 (1951)",
            year: "1951",
            path: ["cwkw", "dollie-duncan-02-11-1951"],
          }),
          mockBookmarkDoc({
            id: "2",
            title: "Ned Crawford Letter (1929)",
            year: "1929",
            path: ["cwkw", "ned-crawford-1929"],
          }),
        ])}
      >
        <Story />
      </Provider>
    ),
  ],
}
