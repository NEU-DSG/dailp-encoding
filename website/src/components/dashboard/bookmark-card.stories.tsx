import type { Meta, StoryObj } from "@storybook/react-vite"
import { BookmarkCard } from "./bookmark-card"

const meta: Meta<typeof BookmarkCard> = {
  title: "Dashboard/BookmarkCard",
  component: BookmarkCard,
}

export default meta
type Story = StoryObj<typeof meta>

export const WithLink: Story = {
  args: {
    thumbnail: "https://placehold.co/300x200?text=WithLink",
    header: { text: "Letter to Dollie Duncan on Oklahoma State Penitentiary stationery 1951-02-11 (1951)", link: "/collections/cwkw/dollie-duncan-02-11-1951" },
    description: "1951",
  },
}

export const WithoutLink: Story = {
  args: {
    thumbnail: "https://placehold.co/300x200?text=WithoutLink",
    header: { text: "Ned Crawford Letter (1929)", link: undefined },
    description: "1929",
  },
}

export const UnknownDate: Story = {
  args: {
    thumbnail: "https://placehold.co/300x200?text=UnknownDate",
    header: { text: "Test Unknown Date", link: "/collections/cwkw/test1" },
    description: "",
  },
}
