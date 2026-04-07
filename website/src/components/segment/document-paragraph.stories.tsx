import type { Meta, StoryObj } from "@storybook/react-vite"
import React from "react"
import { Provider, createClient } from "urql"
import { never } from "wonka"
import * as Dailp from "src/graphql/dailp"
import { LevelOfDetail } from "src/pages/documents/types"
import { EditWordCheckProvider } from "../edit-word-feature/edit-word-check-context"
import { FormProvider } from "../edit-word-feature/edit-word-form-context"
import { DocumentParagraph } from "./segment"

function makeWord(
  id: string,
  index: number,
  source: string,
  romanizedSource: string,
  gloss: string
) {
  return {
    __typename: "AnnotatedForm" as const,
    id,
    index,
    source,
    romanizedSource,
    phonemic: null,
    segments: [
      {
        __typename: "WordSegment" as const,
        morpheme: "*",
        gloss,
        matchingTag: null,
        role: Dailp.WordSegmentRole.Morpheme,
        previousSeparator: null,
      },
    ],
    englishGloss: [gloss],
    commentary: null,
    ingestedAudioTrack: null,
    editedAudio: [],
    userContributedAudio: [],
  }
}

const mockParagraph = {
  __typename: "DocumentParagraph" as const,
  id: "para-001",
  index: 1,
  translation: "I just received your letter and I was very glad.",
  source: [
    makeWord("w-001", 1, "Ꭷ", "ka", "Now"),
    makeWord("w-002", 2, "ᎩᎾᎵᎢ", "ginali'i", "my friend"),
    makeWord("w-003", 3, "ᎠᏥᎩᎵ", "atsgili", "Archie"),
    makeWord("w-004", 4, "ᏩᏯ", "wahya", "Wolf"),
  ],
  comments: [],
}

const mockPanelDetails = {
  currContents: null,
  setCurrContents: () => {},
}

function createMockClient() {
  const client = createClient({
    url: "http://localhost/graphql",
    exchanges: [],
  })
  client.executeQuery = (() => never) as any
  client.executeMutation = (() => never) as any
  client.executeSubscription = (() => never) as any
  return client
}

const meta: Meta<typeof DocumentParagraph> = {
  title: "Documents/Segment/DocumentParagraph",
  component: DocumentParagraph,
  decorators: [
    (Story: React.FC) => (
      <Provider value={createMockClient()}>
        <EditWordCheckProvider>
          <FormProvider>
            <Story />
          </FormProvider>
        </EditWordCheckProvider>
      </Provider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

const baseArgs = {
  segment: mockParagraph as any,
  onOpenDetails: () => {},
  cherokeeRepresentation: Dailp.CherokeeOrthography.Taoc,
  pageImages: [],
  wordPanelDetails: mockPanelDetails,
}

export const StoryLevel: Story = {
  args: {
    ...baseArgs,
    levelOfDetail: LevelOfDetail.Story,
  },
}

export const PronunciationLevel: Story = {
  args: {
    ...baseArgs,
    levelOfDetail: LevelOfDetail.Pronunciation,
  },
}

export const SegmentationLevel: Story = {
  args: {
    ...baseArgs,
    levelOfDetail: LevelOfDetail.Segmentation,
  },
}

export const NoTranslation: Story = {
  args: {
    ...baseArgs,
    levelOfDetail: LevelOfDetail.Pronunciation,
    segment: { ...mockParagraph, translation: null } as any,
  },
}
