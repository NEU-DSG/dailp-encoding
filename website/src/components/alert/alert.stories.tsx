import type { Meta, StoryObj } from "@storybook/react-vite"
import { fn } from "storybook/test"
import { Alert } from "./alert"

const meta: Meta<typeof Alert> = {
  title: "Components/Alert",
  component: Alert,
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: "This is an alert message.",
  },
}
