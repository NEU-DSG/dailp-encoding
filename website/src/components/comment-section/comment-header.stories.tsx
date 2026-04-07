import type { Meta, StoryObj } from "@storybook/react-vite"
import * as Dailp from "src/graphql/dailp"
import { CommentHeader } from "./comment-section"

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

const headerMeta: Meta<typeof CommentHeader> = {
  title: "Documents/CommentHeader",
  component: CommentHeader,
}

export default headerMeta
type HeaderStory = StoryObj<typeof headerMeta>

export const Default: HeaderStory = {
  args: {
    comment: mockComment,
  },
}

export const Edited: HeaderStory = {
  args: {
    comment: {
      ...mockComment,
      edited: true,
    },
  },
}
