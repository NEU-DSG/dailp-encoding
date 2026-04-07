import type { Meta, StoryObj } from "@storybook/react-vite"
import { Dropdown } from "./dropdown"
import { label } from "aws-amplify"

const meta: Meta<typeof Dropdown> = {
  title: "Components/Dropdown",
  component: Dropdown,
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: "Select Citation Style",
    options: ["APA", "MLA", "Chicago"],
    selected: null,
    setSelected: (value: string) => alert(`Selected: ${value}`),
    addButtonLabel: "Choose Style",
  },
}

export const Variation: Story = {
  args: {
    label: "Variant Dropdown",
    options: ["test1", "test2", "test3"],
    selected: null,
    setSelected: (value: string) => alert(`Selected: ${value}`),
    addButtonLabel: "Choose Option",
  },
}
