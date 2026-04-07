import type { Meta, StoryObj } from "@storybook/react-vite"
import React from "react"
import { CitationField } from "./citation-field"

const meta: Meta<typeof CitationField> = {
  title: "Documents/CitationField",
  component: CitationField,
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    citation: "Citation 1 (2026)"
  },
}

export const Empty: Story = {
  args: {
    citation: null
  },
}
