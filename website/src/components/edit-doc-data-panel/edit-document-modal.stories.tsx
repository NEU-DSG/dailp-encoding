import type { Meta, StoryObj } from "@storybook/react-vite"
import React from "react"
import * as Dailp from "src/graphql/dailp"
import { EditDocumentModal } from "./edit-document-modal"
import { EditingProvider } from "./editing-context"

function mockAnnotatedDoc(
  overrides: Partial<Dailp.AnnotatedDoc> = {}
): Dailp.AnnotatedDoc {
  return {
    __typename: "AnnotatedDoc" as const,
    id: "doc-001",
    title: "Untitled",
    slug: "untitled",
    isReference: false,
    orderIndex: 0,
    formCount: 0,
    bookmarkedOn: null,
    date: null,
    sources: [],
    editedAudio: [],
    userContributedAudio: [],
    translatedPages: null,
    chapters: null,
    collection: null,
    pageImages: null,
    ingestedAudioTrack: null,
    contributors: [],
    creators: [],
    keywords: [],
    languages: [],
    subjectHeadings: [],
    spatialCoverage: [],
    forms: [],
    unresolvedForms: [],
    format: null,
    genre: null,
    ...overrides,
  }
}

const fullMetadata = mockAnnotatedDoc({
  id: "doc-001",
  slug: "dollie-duncan-02-11-1951",
  title:
    "Letter to Dollie Duncan on Oklahoma State Penitentiary stationery 1951-02-11",
  date: {
    __typename: "Date" as const,
    day: 11,
    month: 2,
    year: 1951,
    formattedDate: "February 11, 1951",
  },
  format: {
    __typename: "Format" as const,
    id: "f1",
    name: "Format placeholder",
    status: Dailp.ApprovalStatus.Approved,
  },
  genre: {
    __typename: "Genre" as const,
    id: "g1",
    name: "Document type placeholder",
    status: Dailp.ApprovalStatus.Approved,
  },
  contributors: [
    {
      __typename: "Contributor" as const,
      id: "c1",
      name: "Clara Proctor",
      role: Dailp.ContributorRole.Translator,
      details: null,
    },
    {
      __typename: "Contributor" as const,
      id: "c2",
      name: "Ernestine Berry",
      role: Dailp.ContributorRole.Translator,
      details: null,
    },
    {
      __typename: "Contributor" as const,
      id: "c3",
      name: "Jeffrey Bourns",
      role: Dailp.ContributorRole.Annotator,
      details: null,
    },
    {
      __typename: "Contributor" as const,
      id: "c4",
      name: "Ellen Cushman",
      role: Dailp.ContributorRole.Annotator,
      details: null,
    },
    {
      __typename: "Contributor" as const,
      id: "c5",
      name: "Melissa Torres",
      role: Dailp.ContributorRole.Annotator,
      details: null,
    },
    {
      __typename: "Contributor" as const,
      id: "c6",
      name: "Eva Garroutte",
      role: Dailp.ContributorRole.Annotator,
      details: null,
    },
  ],
  sources: [
    {
      __typename: "SourceAttribution" as const,
      name: "The Newberry Library",
      link: "https://www.newberry.org/",
    },
  ],
  keywords: [
    {
      __typename: "Keyword" as const,
      id: "k1",
      name: "Keywords placeholder",
      status: Dailp.ApprovalStatus.Approved,
    },
  ],
  languages: [
    {
      __typename: "Language" as const,
      id: "l1",
      name: "Languages placeholder",
      status: Dailp.ApprovalStatus.Approved,
    },
  ],
  subjectHeadings: [
    {
      __typename: "SubjectHeading" as const,
      id: "sh1",
      name: "Subject headings placeholder",
      status: Dailp.ApprovalStatus.Approved,
    },
  ],
  spatialCoverage: [
    {
      __typename: "SpatialCoverage" as const,
      id: "sc1",
      name: "Spatial coverage placeholder",
      status: Dailp.ApprovalStatus.Approved,
    },
  ],
  creators: [
    { __typename: "Creator" as const, id: "cr1", name: "Creator placeholder" },
  ],
})

const sparseMetadata = mockAnnotatedDoc({
  id: "doc-002",
  slug: "dollie-duncan-02-11-1951",
  title:
    "Letter to Dollie Duncan on Oklahoma State Penitentiary stationery 1951-02-11",
  date: {
    __typename: "Date" as const,
    day: 11,
    month: 2,
    year: 1951,
    formattedDate: "February 11, 1951",
  },
  contributors: [
    {
      __typename: "Contributor" as const,
      id: "c1",
      name: "Clara Proctor",
      role: Dailp.ContributorRole.Translator,
      details: null,
    },
    {
      __typename: "Contributor" as const,
      id: "c2",
      name: "Ernestine Berry",
      role: Dailp.ContributorRole.Translator,
      details: null,
    },
    {
      __typename: "Contributor" as const,
      id: "c3",
      name: "Jeffrey Bourns",
      role: Dailp.ContributorRole.Annotator,
      details: null,
    },
    {
      __typename: "Contributor" as const,
      id: "c4",
      name: "Ellen Cushman",
      role: Dailp.ContributorRole.Annotator,
      details: null,
    },
    {
      __typename: "Contributor" as const,
      id: "c5",
      name: "Melissa Torres",
      role: Dailp.ContributorRole.Annotator,
      details: null,
    },
    {
      __typename: "Contributor" as const,
      id: "c6",
      name: "Eva Garroutte",
      role: Dailp.ContributorRole.Annotator,
      details: null,
    },
  ],
})

const meta: Meta<typeof EditDocumentModal> = {
  title: "Documents/EditDocumentModal",
  component: EditDocumentModal,
  decorators: [
    (Story: React.FC) => (
      <EditingProvider>
        <Story />
      </EditingProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    onSubmit: () => {},
    documentMetadata: fullMetadata,
    initialCiteFormat: "apa",
  },
}

export const Sparse: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    onSubmit: () => {},
    documentMetadata: sparseMetadata,
    initialCiteFormat: "apa",
  },
}

export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    onSubmit: () => {},
    documentMetadata: fullMetadata,
  },
}
