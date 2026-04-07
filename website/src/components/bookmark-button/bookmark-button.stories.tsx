import type { Meta, StoryObj } from "@storybook/react-vite"
import { fn } from "storybook/test"
import { BookmarkButton } from "./bookmark-button"

const meta: Meta<typeof BookmarkButton> = {
  title: "Documents/BookmarkButton",
  component: BookmarkButton,
}

export default meta
type Story = StoryObj<typeof meta>

export const NotBookmarked: Story = {
  args: {
    documentId: "123",
    isBookmarked: false,
  },
}

export const Bookmarked: Story = {
  args: {
    documentId: "123",
    isBookmarked: true,
  },
}
