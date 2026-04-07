import type { Meta, StoryObj } from "@storybook/react-vite"
import React from "react"
import { fn } from "storybook/test"
import { CommentValueProvider } from "../comment-section/edit-comment-feature"
import { CommentAction, CommentPanel } from "./comment-panel"

const meta: Meta<typeof CommentPanel> = {
  title: "Documents/CommentPanel",
  component: CommentPanel,
  decorators: [
    (Story: React.FC) => (
      <CommentValueProvider>
        <Story />
      </CommentValueProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const PostCommentOnWord: Story = {
  args: {
    segment: {
      __typename: "AnnotatedForm" as const,
      id: "word-123",
      source: "\u13A3\u13CF\u13F2",
    } as any,
    setIsCommenting: fn(),
    commentAction: CommentAction.PostComment,
  },
}

export const PostCommentOnParagraph: Story = {
  args: {
    segment: {
      __typename: "DocumentParagraph" as const,
      id: "para-1",
      index: 3,
    } as any,
    setIsCommenting: fn(),
    commentAction: CommentAction.PostComment,
  },
}

export const EditComment: Story = {
  args: {
    segment: {
      __typename: "AnnotatedForm" as const,
      id: "word-456",
      source: "word456456456456456",
    } as any,
    setIsCommenting: fn(),
    commentAction: CommentAction.EditComment,
    commentObject: {
      id: 42,
      textContent: "This translation seems off",
      commentType: "SUGGESTION",
    } as any,
  },
}
