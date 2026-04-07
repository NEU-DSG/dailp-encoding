import type { Meta, StoryObj } from "@storybook/react-vite"
import * as Dailp from "src/graphql/dailp"
import { LevelOfDetail } from "src/pages/documents/types"
import { MorphemicSegmentation } from "./segment"

const mockSegments = [
  {
    __typename: "WordSegment" as const,
    morpheme: "test-morpheme-1",
    gloss: "test-tag-1",
    matchingTag: {
      __typename: "MorphemeTag" as const,
      tag: "test-tag-1",
      title: "Test Tag One Title",
    },
    role: Dailp.WordSegmentRole.Morpheme,
    previousSeparator: null,
  },
  {
    __typename: "WordSegment" as const,
    morpheme: "test-morpheme-2",
    gloss: "test-gloss-2",
    matchingTag: null,
    role: Dailp.WordSegmentRole.Morpheme,
    previousSeparator: "-",
  },
  {
    __typename: "WordSegment" as const,
    morpheme: "test-morpheme-3",
    gloss: "test-tag-3",
    matchingTag: {
      __typename: "MorphemeTag" as const,
      tag: "test-tag-3",
      title: "Test Tag Three Title",
    },
    role: Dailp.WordSegmentRole.Morpheme,
    previousSeparator: "-",
  },
]

const meta: Meta<typeof MorphemicSegmentation> = {
  title: "Documents/Segment/MorphemicSegmentation",
  component: MorphemicSegmentation,
}

export default meta
type Story = StoryObj<typeof meta>

const baseArgs = {
  segments: mockSegments as any,
  cherokeeRepresentation: Dailp.CherokeeOrthography.Taoc,
  onOpenDetails: () => {},
  levelOfDetail: LevelOfDetail.Segmentation,
}

export const WithSegments: Story = {
  args: baseArgs,
}

export const UnanalyzedSegment: Story = {
  args: {
    ...baseArgs,
    segments: [
      {
        __typename: "WordSegment" as const,
        morpheme: "test-morpheme-1",
        gloss: "?",
        matchingTag: null,
        role: Dailp.WordSegmentRole.Morpheme,
        previousSeparator: null,
      },
    ] as any,
  },
}

export const NoSegments: Story = {
  args: {
    ...baseArgs,
    segments: [] as any,
  },
}
