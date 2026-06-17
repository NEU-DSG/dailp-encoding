import type { Meta, StoryObj } from "@storybook/react-vite"
import React from "react"
import { CustomCreatable } from "./creatable"

const meta: Meta<typeof CustomCreatable> = {
  title: "Components/CustomCreatable",
  component: CustomCreatable,
}

export default meta
type Story = StoryObj<typeof meta>

const sampleOptions = [
  { value: "T1", label: "Test 1" },
  { value: "T2", label: "Test 2" },
  { value: "T3", label: "Test 3" },
  { value: "T4", label: "Test 4" },
]

export const WithOptions: Story = {
  args: {
    options: sampleOptions,
    onChange: () => {},
  },
}

export const Empty: Story = {
  args: {
    options: [],
    onChange: () => {},
  },
}

export const WithDefaultValue: Story = {
  args: {
    options: sampleOptions,
    defaultValue: { value: "T2", label: "Test 2" },
    onChange: () => {},
  },
}
