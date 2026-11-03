import { CollectionSection } from "src/graphql/dailp"

// Data for representing chatper on the Edit TOC page
export type ChapterNode = {
  id?: string // uuid of chapter or nothing for newly staged chapters
  clientId?: string // Id of the client's row
  title: string
  slug: string
  section: CollectionSection
  indexInParent: number
  path: string[]
  children: ChapterNode[]
  isNew?: boolean // Representing after a chapter is added and before is saved into db
}

// Enum of sections
export type SectionKey = "intro" | "body" | "credit"

// Struct of toc
export type ChaptersBySection = {
  intro: ChapterNode[]
  body: ChapterNode[]
  credit: ChapterNode[]
}

// One draft chapter slot
export type DraftTarget = {
  sectionKey: SectionKey
  parentId: string | null // id of parent or null if this isnt subchapter
}
