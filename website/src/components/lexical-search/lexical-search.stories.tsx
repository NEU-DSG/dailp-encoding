import type { Meta, StoryObj } from "@storybook/react-vite"
import React from "react"
import { createClient, Provider } from "urql"
import { fromValue, never } from "wonka"
import { Timeline } from "./lexical-search"

function mockResult(
  source: string,
  romanizedSource: string | null,
  englishGloss: string[],
  index: number,
  documentSlug: string | null
) {
  return {
    __typename: "AnnotatedForm" as const,
    source,
    normalizedSource: null,
    romanizedSource,
    englishGloss,
    index,
    document: documentSlug
      ? { __typename: "AnnotatedDoc" as const, id: documentSlug, slug: documentSlug, isReference: false }
      : null,
  }
}

const mockResults = [
  mockResult("ᎧᎦᎵ", "kaga'li", ["February"], 3, "dollie-duncan-02-11-1951"),
  mockResult("ᏥᎾᎩ", "jinagi", ["I just received it"], 12, "ned-crawford-1929"),
  mockResult("test", "test", ["test"], 1, null),
  mockResult("ᎬᏯᎵᎮᎵᏥ", "gvyalihelichi", ["I thank you"], 7, "dollie-duncan-02-11-1951"),
]

function createMockClient(wordSearch: typeof mockResults | []) {
  const client = createClient({ url: "http://localhost/graphql", exchanges: [] })
  client.executeQuery = () =>
    fromValue({
      stale: false,
      hasNext: false,
      data: { wordSearch },
    }) as any
  client.executeMutation = (() => never) as any
  client.executeSubscription = (() => never) as any
  return client
}

const meta: Meta<typeof Timeline> = {
  title: "Components/LexicalSearch/Timeline",
  component: Timeline,
}

export default meta
type Story = StoryObj<typeof meta>

export const WithResults: Story = {
  args: { gloss: "ᎧᎦᎵ" },
  decorators: [
    (Story: React.FC) => (
      <Provider value={createMockClient(mockResults)}>
        <Story />
      </Provider>
    ),
  ],
}

export const NoResults: Story = {
  args: { gloss: "xyz" },
  decorators: [
    (Story: React.FC) => (
      <Provider value={createMockClient([])}>
        <Story />
      </Provider>
    ),
  ],
}

export const EmptyQuery: Story = {
  args: { gloss: "" },
  decorators: [
    (Story: React.FC) => (
      <Provider value={createMockClient([])}>
        <Story />
      </Provider>
    ),
  ],
}
