import { CollectionSection } from "src/graphql/dailp"
import * as Dailp from "src/graphql/dailp"
import type {
  ChapterNode,
  ChaptersBySection,
  SectionKey,
} from "src/types/edit-toc"

// Returns the stable id for a chapter node, preferring the backend id
export const idOf = (n: any): string => {
  if (!n) return ""
  const persistedId = n?.id != null ? String(n.id) : ""
  const clientId = n?.clientId != null ? String(n.clientId) : ""
  return persistedId || clientId
}

// Generate id for client id of chapter nodes with time and random number
export const generateClientId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2)}`

// Enum to string of section
export const sectionToKey = (section: CollectionSection): SectionKey => {
  if (section === CollectionSection.Intro) return "intro"
  if (section === CollectionSection.Body) return "body"
  if (section === CollectionSection.Credit) return "credit"
  return "body"
}

// Returns lits of slugs as strings for staged chapters not yet saved
export const getPendingSlugs = (chapters: ChapterNode[]): string[] =>
  chapters.flatMap((ch) => [
    ...(ch.isNew ? [ch.slug] : []),
    ...getPendingSlugs(ch.children),
  ])

// Searches all chapters and subchapters for matching id
export const getChapterById = (
  chapters: ChapterNode[],
  chapterId: string
): ChapterNode | undefined => {
  for (const ch of chapters) {
    if (idOf(ch) === chapterId) return ch

    const found = getChapterById(ch.children, chapterId)
    if (found) return found
  }

  return undefined
}

// Reassign the indices of indexInParent to close gaps from deleted chapters
export const updateSectionIndices = (chapters: ChapterNode[]): void => {
  chapters.forEach((ch, idx) => {
    ch.indexInParent = idx + 1
    updateSectionIndices(ch.children)
  })
}

// Moves an elements from startIndex to endIndex
export const moveOneChapter = (
  list: ChapterNode[],
  startIndex: number,
  endIndex: number
): ChapterNode[] => {
  const result = Array.from(list) // New array to prevent mutation of original

  const [removed] = result.splice(startIndex, 1)
  if (!removed) return result // Check for out of bounds

  result.splice(endIndex, 0, removed)
  return result
}

// Update children with new children list of specified chapter
export const updateChildren = (
  chapters: ChapterNode[],
  parentId: string,
  newChildren: ChapterNode[]
): ChapterNode[] =>
  chapters.map((ch) => {
    if (idOf(ch) === parentId) return { ...ch, children: newChildren }
    return {
      ...ch,
      children: updateChildren(ch.children, parentId, newChildren),
    }
  })

// Modifies list and removes a given chapter at top level first, and in lower level if there
export const removeChapterFromSection = (
  chapters: ChapterNode[],
  chapterId: string
): ChapterNode[] => chapters.filter((ch) => idOf(ch) !== chapterId)

// Adds a given chapter to the bottom of list in section or as subchapter
export const addChapterToSection = (
  chapters: ChapterNode[],
  newChapter: ChapterNode,
  parentId: string | null
): ChapterNode[] => {
  if (!parentId) return [...chapters, newChapter] // Add to end if not subchapter

  return chapters.map((ch) => {
    // If subchapter, find parent and then add
    if (idOf(ch) === parentId)
      return { ...ch, children: [...ch.children, newChapter] }

    return {
      ...ch,
      children: addChapterToSection(ch.children, newChapter, parentId),
    }
  })
}

// Creates a ChapterOrderInput array for backend to update from chapter section
export const ChaptersToOrderInput = (
  chapters: ChapterNode[],
  section: CollectionSection
): Dailp.ChapterOrderInput[] => {
  const result: Dailp.ChapterOrderInput[] = []
  for (const chapter of chapters) {
    if (chapter.id) {
      result.push({
        id: chapter.id,
        indexInParent: chapter.indexInParent,
        section,
      })
    }
    result.push(...ChaptersToOrderInput(chapter.children, section))
  }
  return result
}

// Type for add chapter mutation to prevent calling in this file
type AddChapterFn = (args: {
  input: Dailp.AddChapterInput
}) => Promise<{ data?: any; error?: { message?: string } }>

// Slug data returned from query of chapter used to validate pending chapters
type SlugData = {
  allChapterSlugs: ReadonlyArray<{
    id: string
    slug: string
    documentId?: string | null
  }>
}

// Searches a section of chapters looking for just added ones and saves them to db
export const addPendingChapters = async (
  chapters: ChapterNode[],
  section: CollectionSection,
  addChapter: AddChapterFn,
  slugData: SlugData | undefined,
  collectionSlug: string,
  parentChapterId?: string
): Promise<{ updated: ChapterNode[]; error?: string }> => {
  const updated: ChapterNode[] = []

  for (const chapter of chapters) {
    let current = chapter

    if (chapter.isNew && !chapter.id) {
      // Only unassigned/existing chapters can be added so protetive case if not true
      const existingChapter = slugData?.allChapterSlugs.find(
        (s) => s.slug === chapter.slug
      )

      if (!existingChapter)
        return {
          updated,
          error: `No unassigned chapter found with slug "${chapter.slug}"`,
        }

      // Update the information of chapter to backend
      const result = await addChapter({
        input: {
          id: existingChapter.id,
          collectionSlug,
          title: chapter.title,
          slug: chapter.slug,
          section,
          parentId: parentChapterId ?? null,
          documentId: existingChapter.documentId ?? null,
        },
      })

      if (result.error) {
        return {
          updated,
          error: result.error.message || "Failed to add chapter",
        }
      }

      // Update the current chapter with its backend id
      const newId = (result.data as any)?.addCollectionChapter
      current = { ...chapter, id: newId, isNew: false }
    }

    // Do the same for the chapter's children
    const childResult = await addPendingChapters(
      current.children,
      section,
      addChapter,
      slugData,
      collectionSlug,
      current.id
    )

    if (childResult.error)
      return {
        updated: [...updated, { ...current, children: childResult.updated }],
        error: childResult.error,
      }

    updated.push({ ...current, children: childResult.updated })
  }

  return { updated }
}

// Builds a ChapterNodes for the from a list of nodes for visual representation
export const buildChaptersBySection = (
  nodes: readonly any[] | undefined
): ChaptersBySection => {
  if (!nodes) return { intro: [], body: [], credit: [] }

  // Filter out unassigned chapters to not render and make sure they all have client ids
  const usableNodes = (nodes ?? [])
    .filter((n) => n.indexInParent !== -1)
    .map((n) => ({ ...n, clientId: idOf(n) || generateClientId() }))

  // Sort by depth to prevent subchapters showing up before parent which would issues
  const sortedUsableNodes = [...usableNodes].sort((a, b) => {
    const aIsSubchapter = a.path?.length > 2
    const bIsSubchapter = b.path?.length > 2

    if (aIsSubchapter !== bIsSubchapter)
      // Determine order if one is subchapter
      return aIsSubchapter ? 1 : -1

    return (a.indexInParent ?? 0) - (b.indexInParent ?? 0) // Nodes are same level
  })

  // Empty set to lookup already procesed chapters and list of chapters by section
  const slugToNode = new Map<string, ChapterNode>()
  const topLevel: ChaptersBySection = { intro: [], body: [], credit: [] }

  for (const node of sortedUsableNodes) {
    const chapter: ChapterNode = {
      id: node.id,
      clientId: node.clientId,
      title: node.title,
      slug: node.slug,
      section: node.section,
      indexInParent: node.indexInParent,
      path: node.path,
      children: [],
    }
    slugToNode.set(node.slug, chapter)

    const parentSlug =
      node.path && node.path.length > 1
        ? node.path[node.path.length - 2]
        : undefined

    // Make determiniation if chapter is subchapter and has parent, then push to correct place
    if (parentSlug) {
      const parent = slugToNode.get(parentSlug)
      if (parent) {
        parent.children.push(chapter)
      } else {
        // Fallback in case of no parent processed yet despite sorting
        topLevel[sectionToKey(node.section)].push(chapter)
      }
    } else {
      topLevel[sectionToKey(node.section)].push(chapter)
    }
  }

  // Sorts the processed list since subchapters are not in exact order
  const sortProccessedList = (chapters: ChapterNode[]): ChapterNode[] =>
    chapters
      .sort((a, b) => a.indexInParent - b.indexInParent)
      .map((ch) => ({ ...ch, children: sortProccessedList(ch.children) }))

  return {
    intro: sortProccessedList(topLevel.intro),
    body: sortProccessedList(topLevel.body),
    credit: sortProccessedList(topLevel.credit),
  }
}
