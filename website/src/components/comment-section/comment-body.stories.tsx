import type { Meta, StoryObj } from "@storybook/react-vite"
import React from "react"
import * as Dailp from "src/graphql/dailp"
import { CommentBody } from "./comment-section"
import { CommentValueProvider } from "./edit-comment-feature"
import { FormProvider as FormProviderComment } from "./edit-comment-form-context"

const mockComment: Dailp.CommentFieldsFragment = {
  id: "comment-1",
  textContent: "I think this word has a different meaning in this context.",
  commentType: Dailp.CommentType.Suggestion,
  postedAt: {
    date: { formattedDate: "March 15, 2026" },
  },
  postedBy: {
    id: "user-1",
    displayName: "Jane Smith",
  },
  edited: false,
} as any

const meta: Meta<typeof CommentBody> = {
  title: "Documents/CommentBody",
  component: CommentBody,
  decorators: [
    (Story: React.FC) => (
      <CommentValueProvider>
        <FormProviderComment>
          <Story />
        </FormProviderComment>
      </CommentValueProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Suggestion: Story = {
  args: {
    comment: mockComment,
  },
}

export const StoryTag: Story = {
  args: {
    comment: {
      ...mockComment,
      id: "comment-2",
      textContent: "This passage reminds me of a traditional story about the river.",
      commentType: Dailp.CommentType.Story,
    },
  },
}

export const Question: Story = {
  args: {
    comment: {
      ...mockComment,
      id: "comment-3",
      textContent: "Is this the correct syllabary for this word?",
      commentType: Dailp.CommentType.Question,
    },
  },
}
