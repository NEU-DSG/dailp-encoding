import type { Meta, StoryObj } from "@storybook/react-vite"
import React from "react"
import { createClient, Provider } from "urql"
import { fromValue, never } from "wonka"
import * as Dailp from "src/graphql/dailp"
import { CommentStateProvider } from "../comment-panel/comment-state-context"
import { CommentValueProvider } from "./edit-comment-feature"
import { FormProvider as FormProviderComment } from "./edit-comment-form-context"
import { WordCommentSection } from "./comment-section"

const mockWord = {
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

function mockComment(overrides: {
  id: string
  textContent: string
  commentType: Dailp.CommentType
  edited: boolean
  postedBy: { id: string; displayName: string }
  formattedDate: string
}): Dailp.CommentFieldsFragment {
  return {
    __typename: "Comment" as const,
    id: overrides.id,
    textContent: overrides.textContent,
    commentType: overrides.commentType,
    edited: overrides.edited,
    postedAt: {
      __typename: "DateTime" as const,
      timestamp: Math.floor(new Date(overrides.formattedDate).getTime() / 1000),
      date: {
        __typename: "Date" as const,
        year: 2024,
        month: 3,
        day: 15,
        formattedDate: overrides.formattedDate,
      },
    },
    postedBy: {
      __typename: "User" as const,
      id: overrides.postedBy.id,
      displayName: overrides.postedBy.displayName,
    },
  }
}

const mockComments = [
  mockComment({
    id: "comment-001",
    textContent: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sit amet ultricies lorem.",
    commentType: Dailp.CommentType.Story,
    edited: false,
    postedBy: { id: "user-001", displayName: "User1" },
    formattedDate: "March 15, 2024",
  }),
  mockComment({
    id: "comment-002",
    textContent: "Phasellus faucibus magna id dui scelerisque, at consectetur sapien pulvinar.",
    commentType: Dailp.CommentType.Suggestion,
    edited: true,
    postedBy: { id: "user-002", displayName: "User2" },
    formattedDate: "April 2, 2024",
  }),
  mockComment({
    id: "comment-003",
    textContent: "Proin vehicula mauris et turpis rhoncus pulvinar id interdum odio?",
    commentType: Dailp.CommentType.Question,
    edited: false,
    postedBy: { id: "user-003", displayName: "User3" },
    formattedDate: "April 10, 2024",
  }),
]

function createMockClient(comments: Dailp.CommentFieldsFragment[]) {
  const client = createClient({ url: "http://localhost/graphql", exchanges: [] })
  client.executeQuery = () =>
    fromValue({
      stale: false,
      hasNext: false,
      data: {
        wordById: {
          __typename: "AnnotatedForm",
          id: "word-001",
          comments,
        },
      },
    }) as any
  client.executeMutation = (() => never) as any
  client.executeSubscription = (() => never) as any
  return client
}

function Providers({ children, comments }: { children: React.ReactNode; comments: Dailp.CommentFieldsFragment[] }) {
  return (
    <Provider value={createMockClient(comments)}>
      <CommentStateProvider>
        <CommentValueProvider>
          <FormProviderComment>
            {children}
          </FormProviderComment>
        </CommentValueProvider>
      </CommentStateProvider>
    </Provider>
  )
}

// WordCommentSection and ParagraphCommentSection are basically identical.
const meta: Meta<typeof WordCommentSection> = {
  title: "Documents/CommentSection",
  component: WordCommentSection,
}

export default meta
type Story = StoryObj<typeof meta>

export const WithComments: Story = {
  args: { word: mockWord },
  decorators: [
    (Story: React.FC) => (
      <Providers comments={mockComments}>
        <Story />
      </Providers>
    ),
  ],
}

export const Empty: Story = {
  args: { word: mockWord },
  decorators: [
    (Story: React.FC) => (
      <Providers comments={[]}>
        <Story />
      </Providers>
    ),
  ],
}
