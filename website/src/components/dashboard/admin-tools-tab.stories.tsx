import type { Meta, StoryObj } from "@storybook/react-vite"
import { AdminToolsTab } from "./dashboard"

const meta: Meta<typeof AdminToolsTab> = {
  title: "Dashboard/AdminToolsTab",
  component: AdminToolsTab,
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
