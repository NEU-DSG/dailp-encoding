import type { Meta, StoryObj } from "@storybook/react-vite"
import React from "react"
import { createClient, Provider } from "urql"
import { fromValue, never } from "wonka"
import * as Dailp from "src/graphql/dailp"
import { MorphemeDetails } from "./morpheme"

const mockSegment = {
  __typename: "WordSegment" as const,
  morpheme: "a-",
  gloss: "IRR",
  role: null,
  previousSeparator: null,
  matchingTag: {
    __typename: "MorphemeTag" as const,
    tag: "IRR",
    title: "Irrealis Prepronominal Prefix",
  },
}

const mockTag = {
  __typename: "MorphemeTag" as const,
  morphemeType: "Prepronominal Prefix",
  tag: "IRR",
  title: "Irrealis Prepronominal Prefix",
  definition:
    "The Irrealis (IRR) prepronominal prefix references an action that has not occurred and/or might occur. One of the most important functions of this prefix is negation. (CRG: 106-109)",
}

const mockDocuments = [
  {
    __typename: "WordsInDocument" as const,
    documentType: "CORPUS",
    forms: [
      {
        __typename: "AnnotatedForm" as const,
        index: 3,
        source: "ᎧᎦᎵ",
        normalizedSource: null,
        englishGloss: ["February"],
        document: { __typename: "AnnotatedDoc" as const, id: "doc-001", slug: "dollie-duncan-02-11-1951" },
      },
      {
        __typename: "AnnotatedForm" as const,
        index: 12,
        source: "ᏥᎾᎩ",
        normalizedSource: null,
        englishGloss: ["I just received it"],
        document: { __typename: "AnnotatedDoc" as const, id: "doc-002", slug: "ned-crawford-1929" },
      },
    ],
  },
  {
    __typename: "WordsInDocument" as const,
    documentType: "REFERENCE",
    forms: [
      {
        __typename: "AnnotatedForm" as const,
        index: 7,
        source: "ᎬᏯᎵᎮᎵᏥ",
        normalizedSource: "gvyalihelichi",
        englishGloss: ["I thank you"],
        document: { __typename: "AnnotatedDoc" as const, id: "doc-003", slug: "dollie-duncan-02-11-1951" },
      },
    ],
  },
]

function createMockClient(opts: {
  tag: typeof mockTag | null
  documents: typeof mockDocuments | []
}) {
  const client = createClient({ url: "http://localhost/graphql", exchanges: [] })
  client.executeQuery = (request) => {
    const name = (request.query.definitions[0] as any).name?.value
    if (name === "Tag") {
      return fromValue({ stale: false, hasNext: false, data: { tag: opts.tag } }) as any
    }
    if (name === "Morpheme") {
      return fromValue({ stale: false, hasNext: false, data: { documents: opts.documents } }) as any
    }
    return never as any
  }
  client.executeMutation = (() => never) as any
  client.executeSubscription = (() => never) as any
  return client
}

const meta: Meta<typeof MorphemeDetails> = {
  title: "Documents/MorphemeDetails",
  component: MorphemeDetails,
}

export default meta
type Story = StoryObj<typeof meta>

const baseArgs = {
  documentId: "doc-001",
  segment: mockSegment as any,
  cherokeeRepresentation: Dailp.CherokeeOrthography.Taoc,
  hideDialog: () => {},
}

export const WithTagAndOccurrences: Story = {
  args: baseArgs,
  decorators: [
    (Story: React.FC) => (
      <Provider value={createMockClient({ tag: mockTag, documents: mockDocuments })}>
        <Story />
      </Provider>
    ),
  ],
}

export const NoTag: Story = {
  args: baseArgs,
  decorators: [
    (Story: React.FC) => (
      <Provider value={createMockClient({ tag: null, documents: mockDocuments })}>
        <Story />
      </Provider>
    ),
  ],
}

export const NoOccurrences: Story = {
  args: baseArgs,
  decorators: [
    (Story: React.FC) => (
      <Provider value={createMockClient({ tag: mockTag, documents: [] })}>
        <Story />
      </Provider>
    ),
  ],
}
