import type { Meta, StoryObj } from "@storybook/react-vite"
import React from "react"
import { useDialogState } from "reakit"
import { CollectionSection } from "src/graphql/dailp"
import {
  Chapter,
  CollectionContext,
} from "src/pages/edited-collections/edited-collection-context"
import { PageContextProvider } from "src/renderer/PageShell"
import { Sidebar, MobileSidebar } from "./sidebar"

const mockChapters: Chapter[] = [
  {
    title: "Acknowledgements",
    slug: "acknowledgements",
    indexInParent: 0,
    section: CollectionSection.Intro,
  },
  {
    title: "Preface",
    slug: "preface",
    indexInParent: 1,
    section: CollectionSection.Intro,
  },
  {
    title: "Cherokees Writing the Keetoowah Way (CWKW)",
    slug: "cwkw",
    indexInParent: 2,
    section: CollectionSection.Intro,
  },
  {
    title: "Echota Funeral Notices",
    slug: "echota-funeral-notices",
    indexInParent: 0,
    section: CollectionSection.Body,
  },
  {
    title: "Letters as Hidden Literacies",
    slug: "letters-as-hidden-literacies",
    indexInParent: 1,
    section: CollectionSection.Body,
  },
  {
    title: "Stories as Knowledge",
    slug: "stories-as-knowledge",
    indexInParent: 2,
    section: CollectionSection.Body,
  },
  {
    title: "Cherokee Sovereignty",
    slug: "cherokee-sovereignty",
    indexInParent: 3,
    section: CollectionSection.Body,
  },
  {
    title: "About Us",
    slug: "about-us",
    indexInParent: 0,
    section: CollectionSection.Credit,
  },
  {
    title: "CWKW Reference",
    slug: "cwkw-reference",
    indexInParent: 1,
    section: CollectionSection.Credit,
  },
  {
    title: "Teaching and Learning with DAILP",
    slug: "teaching-and-learning-with-dailp",
    indexInParent: 2,
    section: CollectionSection.Credit,
  },
]

const mockPageContext = {
  routeParams: { collectionSlug: "cwkw" },
  urlParsed: { search: {}, searchOriginal: "" } as any,
  urlPathname: "/",
  Page: () => null,
  buildDate: new Date(),
  urqlState: {},
} as any

const WithCollectionContext = (Story: React.FC) => {
  const dialog = useDialogState({ animated: true })
  return (
    <PageContextProvider pageContext={mockPageContext}>
      <CollectionContext.Provider
        value={{ dialog, chapters: mockChapters, selected: [], setSelected: () => {} }}
      >
        <Story />
      </CollectionContext.Provider>
    </PageContextProvider>
  )
}

const meta: Meta<typeof Sidebar> = {
  title: "Components/Sidebar",
  component: Sidebar,
  decorators: [WithCollectionContext],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Mobile: Story = {
  component: MobileSidebar,
}
