import type { Meta, StoryObj } from "@storybook/react-vite"
import React from "react"
import { createClient, Provider } from "urql"
import { fromValue, never } from "wonka"
import { EditingProvider } from "../edit-doc-data-panel/editing-context"
import { FormProvider } from "../edit-doc-data-panel/edit-doc-data-form-context"
import { DocumentInfo, Document } from "./document-info"

function mockDoc(overrides: Partial<Document> = {}): Document {
  return {
    __typename: "AnnotatedDoc" as const,
    id: overrides.id ?? "doc-001",
    title: overrides.title ?? "Untitled",
    slug: overrides.slug ?? "untitled",
    isReference: overrides.isReference ?? false,
    date: overrides.date ?? null,
    bookmarkedOn: overrides.bookmarkedOn ?? null,
    sources: overrides.sources ?? [],
    editedAudio: overrides.editedAudio ?? [],
    userContributedAudio: overrides.userContributedAudio ?? [],
    translatedPages: overrides.translatedPages ?? null,
    chapters: overrides.chapters ?? null,
  }
}

function mockDocDetails(overrides: Record<string, any> = {}) {
  return {
    __typename: "AnnotatedDoc" as const,
    id: overrides["id"] ?? "doc-001",
    slug: overrides["slug"] ?? "untitled",
    title: overrides["title"] ?? "Untitled",
    format: overrides["format"] ?? null,
    genre: overrides["genre"] ?? null,
    date: overrides["date"] ?? null,
    contributors: overrides["contributors"] ?? [],
    sources: overrides["sources"] ?? [],
    keywords: overrides["keywords"] ?? [],
    languages: overrides["languages"] ?? [],
    subjectHeadings: overrides["subjectHeadings"] ?? [],
    spatialCoverage: overrides["spatialCoverage"] ?? [],
    creators: overrides["creators"] ?? [],
  }
}

function createMockProvider(details: ReturnType<typeof mockDocDetails>) {
  const client = createClient({ url: "http://localhost/graphql", exchanges: [] })
  client.executeQuery = () =>
    fromValue({
      stale: false,
      hasNext: false,
      data: { document: details },
    }) as any
  client.executeMutation = (() => never) as any
  client.executeSubscription = (() => never) as any
  return client
}

const meta: Meta<typeof DocumentInfo> = {
  title: "Documents/DocumentInfo",
  component: DocumentInfo,
}

export default meta
type Story = StoryObj<typeof meta>

// Full metadata — all fields populated with placeholder values
const fullDetails = mockDocDetails({
  id: "doc-001",
  slug: "dollie-duncan-02-11-1951",
  title: "Letter to Dollie Duncan on Oklahoma State Penitentiary stationery 1951-02-11",
  format: { __typename: "Format" as const, id: "f1", name: "Format placeholder", status: "APPROVED" },
  genre: { __typename: "Genre" as const, id: "g1", name: "Document type placeholder", status: "APPROVED" },
  date: { __typename: "Date" as const, day: 11, month: 2, year: 1951 },
  contributors: [
    { __typename: "Contributor" as const, id: "c1", name: "Clara Proctor", role: "TRANSLATOR" },
    { __typename: "Contributor" as const, id: "c2", name: "Ernestine Berry", role: "TRANSLATOR" },
    { __typename: "Contributor" as const, id: "c3", name: "Jeffrey Bourns", role: "ANNOTATOR" },
    { __typename: "Contributor" as const, id: "c4", name: "Ellen Cushman", role: "ANNOTATOR" },
    { __typename: "Contributor" as const, id: "c5", name: "Melissa Torres", role: "ANNOTATOR" },
    { __typename: "Contributor" as const, id: "c6", name: "Eva Garroutte", role: "ANNOTATOR" },
  ],
  sources: [
    { __typename: "SourceAttribution" as const, name: "Source placeholder", link: "https://www.placeholder.org/" },
  ],
  keywords: [
    { __typename: "Keyword" as const, id: "k1", name: "Keywords placeholder", status: "APPROVED" },
  ],
  languages: [
    { __typename: "Language" as const, id: "l1", name: "Languages placeholder", status: "APPROVED" },
  ],
  subjectHeadings: [
    { __typename: "SubjectHeading" as const, id: "sh1", name: "Subject headings placeholder", status: "APPROVED" },
  ],
  spatialCoverage: [
    { __typename: "SpatialCoverage" as const, id: "sc1", name: "Spatial coverage placeholder", status: "APPROVED" },
  ],
  creators: [
    { __typename: "Creator" as const, id: "cr1", name: "Creator placeholder" },
  ],
})

export const Default: Story = {
  args: {
    doc: mockDoc({
      id: "doc-001",
      slug: "dollie-duncan-02-11-1951",
      title: "Letter to Dollie Duncan on Oklahoma State Penitentiary stationery 1951-02-11",
      date: { __typename: "Date" as const, year: 1951 },
      sources: [
        { __typename: "SourceAttribution" as const, name: "The Newberry Library", link: "https://www.newberry.org/" },
      ],
    }),
  },
  decorators: [
    (Story: React.FC) => (
      <Provider value={createMockProvider(fullDetails)}>
        <EditingProvider>
          <FormProvider>
            <Story />
          </FormProvider>
        </EditingProvider>
      </Provider>
    ),
  ],
}

// Sparse metadata — real example from the website, most fields empty
const sparseDetails = mockDocDetails({
  id: "doc-002",
  slug: "dollie-duncan-02-11-1951",
  title: "Letter to Dollie Duncan on Oklahoma State Penitentiary stationery 1951-02-11",
  date: { __typename: "Date" as const, day: 11, month: 2, year: 1951 },
  contributors: [
    { __typename: "Contributor" as const, id: "c1", name: "Clara Proctor", role: "TRANSLATOR" },
    { __typename: "Contributor" as const, id: "c2", name: "Ernestine Berry", role: "TRANSLATOR" },
    { __typename: "Contributor" as const, id: "c3", name: "Jeffrey Bourns", role: "ANNOTATOR" },
    { __typename: "Contributor" as const, id: "c4", name: "Ellen Cushman", role: "ANNOTATOR" },
    { __typename: "Contributor" as const, id: "c5", name: "Melissa Torres", role: "ANNOTATOR" },
    { __typename: "Contributor" as const, id: "c6", name: "Eva Garroutte", role: "ANNOTATOR" },
  ],
})

export const Sparse: Story = {
  args: {
    doc: mockDoc({
      id: "doc-002",
      slug: "dollie-duncan-02-11-1951",
      title: "Letter to Dollie Duncan on Oklahoma State Penitentiary stationery 1951-02-11",
      date: { __typename: "Date" as const, year: 1951 },
    }),
  },
  decorators: [
    (Story: React.FC) => (
      <Provider value={createMockProvider(sparseDetails)}>
        <EditingProvider>
          <FormProvider>
            <Story />
          </FormProvider>
        </EditingProvider>
      </Provider>
    ),
  ],
}

// No data — query returns null document (shows loading state)
function createEmptyMockProvider() {
  const client = createClient({ url: "http://localhost/graphql", exchanges: [] })
  client.executeQuery = () =>
    fromValue({
      stale: false,
      hasNext: false,
      data: { document: null },
    }) as any
  client.executeMutation = (() => never) as any
  client.executeSubscription = (() => never) as any
  return client
}

export const NoData: Story = {
  args: {
    doc: mockDoc(),
  },
  decorators: [
    (Story: React.FC) => (
      <Provider value={createEmptyMockProvider()}>
        <EditingProvider>
          <FormProvider>
            <Story />
          </FormProvider>
        </EditingProvider>
      </Provider>
    ),
  ],
}
