import type { Meta, StoryObj } from "@storybook/react-vite"
import React from "react"
import { MdDelete, MdEdit, MdOutlineBookmarkAdd } from "react-icons/md"
import { Button, CleanButton, IconButton, IconTextButton } from "./button"

// Use a generic meta since the file exports multiple components
const meta: Meta = {
  title: "Components/Button",
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <Button>Click me</Button>,
}

export const Clean: Story = {
  render: () => <CleanButton>Clean button</CleanButton>,
}

export const IconRound: Story = {
  render: () => (
    <IconButton round>
      <MdEdit />
    </IconButton>
  ),
}

export const IconSquare: Story = {
  render: () => (
    <IconButton round={false}>
      <MdDelete />
    </IconButton>
  ),
}

export const IconWithText: Story = {
  render: () => (
    <IconTextButton icon={<MdOutlineBookmarkAdd />}>Bookmark</IconTextButton>
  ),
}
