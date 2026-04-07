import type { Meta, StoryObj } from "@storybook/react-vite"
import { fn } from "storybook/test"
import { CreativeCommonsBy } from "./creative-commons"

const meta: Meta<typeof CreativeCommonsBy> = {
  title: "Components/Attributions",
  component: CreativeCommonsBy,
}

export default meta
type Story = StoryObj<typeof meta>

export const OneAuthor: Story = {
  args: {
    title: "Example Work",
    authors: [{ name: "Author One", link: "https://example.com/author-one" }],
  },
}

export const TwoAuthors: Story = {
  args: {
    title: "Example Work 1",
    authors: [
      { name: "Author One", link: "https://example.com/author-one" },
      { name: "Author Two" },
    ],
  },
}

export const ThreeAuthors: Story = {
  args: {
    title: "Example Work 2",
    authors: [
      { name: "Author One", link: "https://example.com/author-one" },
      { name: "Author Two" },
      { name: "Author Three" },
    ],
  },
}