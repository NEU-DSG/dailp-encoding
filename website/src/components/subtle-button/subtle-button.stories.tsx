import type { Meta, StoryObj } from "@storybook/react-vite"
import { SubtleButton } from "./subtle-button"

const meta: Meta<typeof SubtleButton> = {
  title: "Components/SubtleButton",
  component: SubtleButton,
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: "Discard",
  },
}

export const Active: Story = {
  args: {
    children: "Discard",
    className: undefined,
  },
}
