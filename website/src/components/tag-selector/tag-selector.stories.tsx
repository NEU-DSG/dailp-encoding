import type { Meta, StoryObj } from "@storybook/react-vite"
import { TagSelector } from "./tag-selector"

const meta: Meta<typeof TagSelector> = {
  title: "Components/TagSelector",
  component: TagSelector,
}

export default meta
type Story = StoryObj<typeof meta>

const approvedKeywords = [
  "Colonialism",
  "Government",
  "Politics",
  "History",
  "Culture",
  "Law",
  "Constitution",
  "Indigenous Rights",
  "Treaty",
  "Land Rights",
  "Self-Determination",
  "Tribal Governance",
]

const baseArgs = {
  label: "Keywords",
  approvedTags: approvedKeywords,
  addButtonLabel: "+ Add keyword",
  onAdd: () => {},
  onRemove: () => {},
}

export const WithSelectedTags: Story = {
  args: {
    ...baseArgs,
    selectedTags: ["History", "Culture"],
  },
}

export const WithNewTag: Story = {
  args: {
    ...baseArgs,
    selectedTags: ["History", "Culture", "Law"],
    newTags: new Set(["Law"]),
  },
}

export const Empty: Story = {
  args: {
    ...baseArgs,
    selectedTags: [],
  },
}

export const ReadOnly: Story = {
  args: {
    ...baseArgs,
    selectedTags: ["History", "Culture"],
    onAdd: undefined,
    onRemove: undefined,
  },
}
