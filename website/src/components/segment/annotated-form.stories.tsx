import type { Meta, StoryObj } from "@storybook/react-vite"
import React from "react"
import { createClient, Provider } from "urql"
import { never } from "wonka"
import * as Dailp from "src/graphql/dailp"
import { LevelOfDetail } from "src/pages/documents/types"
import { EditWordCheckProvider } from "../edit-word-feature/edit-word-check-context"
import { FormProvider } from "../edit-word-feature/edit-word-form-context"
import { AnnotatedForm } from "./segment"

const mockWord = {
  __typename: "AnnotatedForm" as const,
  id: "e55dd52f-325c-4f7a-9fc5-a0eb0dabc699",
  index: 3,
  source: "ᎧᎦᎵ",
  romanizedSource: "Kagaʔli",
  phonemic: null,
  segments: [
    {
      __typename: "WordSegment" as const,
      morpheme: "*",
      gloss: "February",
      matchingTag: null,
      role: Dailp.WordSegmentRole.Morpheme,
      previousSeparator: null,
    },
  ],
  englishGloss: ["February"],
  commentary: null,
  ingestedAudioTrack: null,
  editedAudio: [],
  userContributedAudio: [],
}

const mockPanelDetails = {
  currContents: null,
  setCurrContents: () => {},
}

function createMockClient() {
  const client = createClient({ url: "http://localhost/graphql", exchanges: [] })
  client.executeQuery = (() => never) as any
  client.executeMutation = (() => never) as any
  client.executeSubscription = (() => never) as any
  return client
}

const meta: Meta<typeof AnnotatedForm> = {
  title: "Documents/Segment/AnnotatedForm",
  component: AnnotatedForm,
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
  segment: mockWord as any,
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

export const NoSegments: Story = {
  args: {
    ...baseArgs,
    levelOfDetail: LevelOfDetail.Segmentation,
    segment: { ...mockWord, segments: [] } as any,
  },
}
