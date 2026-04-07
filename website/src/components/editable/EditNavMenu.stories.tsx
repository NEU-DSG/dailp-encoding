import type { Meta, StoryObj } from "@storybook/react-vite"
import React from "react"
import { createClient, Provider } from "urql"
import { fromValue, never } from "wonka"
import { EditableNavMenu } from "./EditNavMenu"

function mockMenuItem(label: string, path: string, children: any[] = []) {
  return {
    __typename: "MenuItem" as const,
    label,
    path,
    items: children.length ? children : null,
  }
}

const mockMenu = {
  __typename: "Menu" as const,
  id: "menu-001",
  name: "Main Navigation",
  slug: "main-nav",
  items: [
    mockMenuItem("Home", "/"),
    mockMenuItem("Collections", "/collections", [
      mockMenuItem("CWKW", "/collections/cwkw"),
      mockMenuItem("Willie Jumper Manuscripts", "/collections/willie-jumper-stories"),
    ]),
    mockMenuItem("Glossary of Terms", "/tools/glossary"),
    mockMenuItem("Support", "/about/support"),
  ],
}

const emptyMenu = {
  ...mockMenu,
  name: "Empty Menu",
  items: [],
}

function createMockClient(menu: typeof mockMenu | typeof emptyMenu | null) {
  const client = createClient({ url: "http://localhost/graphql", exchanges: [] })
  client.executeQuery = () =>
    fromValue({
      stale: false,
      hasNext: false,
      data: { menuBySlug: menu },
    }) as any
  client.executeMutation = (() => never) as any
  client.executeSubscription = (() => never) as any
  return client
}

const meta: Meta<typeof EditableNavMenu> = {
  title: "Components/EditableNavMenu",
  component: EditableNavMenu,
}

export default meta
type Story = StoryObj<typeof meta>

export const WithItems: Story = {
  args: { navMenuSlug: "main-nav" },
  decorators: [
    (Story: React.FC) => (
      <Provider value={createMockClient(mockMenu)}>
        <Story />
      </Provider>
    ),
  ],
}

export const EmptyMenu: Story = {
  args: { navMenuSlug: "empty-menu" },
  decorators: [
    (Story: React.FC) => (
      <Provider value={createMockClient(emptyMenu)}>
        <Story />
      </Provider>
    ),
  ],
}

export const NoData: Story = {
  args: { navMenuSlug: "missing-menu" },
  decorators: [
    (Story: React.FC) => (
      <Provider value={createMockClient(null)}>
        <Story />
      </Provider>
    ),
  ],
}
