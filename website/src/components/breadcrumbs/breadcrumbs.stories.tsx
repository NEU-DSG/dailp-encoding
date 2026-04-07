import type { Meta, StoryObj } from "@storybook/react-vite"
import { fn } from "storybook/test"
import { Breadcrumbs } from "./breadcrumbs"

const meta: Meta<typeof Breadcrumbs> = {
  title: "Components/Breadcrumbs",
  component: Breadcrumbs,
}

export default meta
type Story = StoryObj<typeof meta>

export const ThreeLevels: Story = {
  render: () => (
    <Breadcrumbs>
      <a href="/">Home</a>
      <a href="/collections">Collections</a>
      <span>Current Page</span>
    </Breadcrumbs>
  ),
}

export const SingleLevel: Story = {
  render: () => (
    <Breadcrumbs>
      <span>Home</span>
    </Breadcrumbs>
  ),
}