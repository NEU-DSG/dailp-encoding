import type { Meta, StoryObj } from "@storybook/react-vite"
import React from "react"
import PageImages from "./page-image"

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
}

const noSourceDoc = {
  ...dollieDoc,
  sources: [],
}

const meta: Meta<typeof PageImages> = {
  title: "Documents/PageImages",
  component: PageImages,
  decorators: [
    (Story: React.FC) => (
      <div style={{ width: "800px", height: "600px", overflow: "hidden" }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const SinglePage: Story = {
  args: {
    document: dollieDoc as any,
    pageImages: {
      urls: ["https://placehold.co/800x1000#"],
    },
  },
}

export const MultiPage: Story = {
  args: {
    document: dollieDoc as any,
    pageImages: {
      urls: [
        "https://placehold.co/800x1000#",
        "https://placehold.co/800x1000#/png",
        "https://placehold.co/800x1000#/jpg",
      ],
    },
  },
}

export const NoSource: Story = {
  args: {
    document: noSourceDoc as any,
    pageImages: {
      urls: ["https://placehold.co/800x1000#"],
    },
  },
}
