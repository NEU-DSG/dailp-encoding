import type { Meta, StoryObj } from "@storybook/react-vite"
import { fn } from "storybook/test"
import { AccountMenu } from "./account-menu"

const meta: Meta<typeof AccountMenu> = {
  title: "Components/AccountMenu",
  component: AccountMenu,
}

export default meta
type Story = StoryObj<typeof meta>

export const Example1: Story = {}
