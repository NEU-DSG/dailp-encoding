import React, { useEffect, useState } from "react"
import { MoveHandler, NodeRendererProps, Tree, TreeApi } from "react-arborist"
import { MdDragIndicator } from "react-icons/md/index"
import ConfirmationPopup from "src/components/confirmation-popup"
import {
  EditTocProvider,
  useEditToc,
} from "src/components/editable/toc/edit-toc-context"
import { InfoTooltip } from "src/components/info-tooltip"
import Sidebar from "src/components/sidebar"
import * as Dailp from "src/graphql/dailp"
import { CollectionSection } from "src/graphql/dailp"
import * as css from "./EditToc.css"
import PreviewToc from "./preview-toc-content"

// Data for representing chatper on the Edit TOC page
export type ChapterNode = {
  id?: string // uuid of chapter or nothing for newly staged chapters
  clientId?: string // Id of the client's row
  documentId?: string // doc id of this chapter which is used for reordering
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

// Max depth of chapter levels based on existing collections
export const MAX_CHAPTER_LEVEL = 2

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

// Removes target chapter by looking in nested chapter nodes
export const removeNestedChapters = (
  chapters: ChapterNode[],
  chapterId: string
): ChapterNode[] =>
  chapters
    .filter((ch) => idOf(ch) !== chapterId)
    .map((ch) => ({
      ...ch,
      children: removeNestedChapters(ch.children, chapterId),
    }))

// Search for parent target id and then inserts chapter list into it
export const insertChaptersIntoParent = (
  chapters: ChapterNode[],
  parentId: string,
  newChapters: ChapterNode[],
  index: number
): ChapterNode[] =>
  chapters.map((ch) => {
    if (idOf(ch) === parentId) {
      const children = [...ch.children]
      children.splice(index, 0, ...newChapters)
      return { ...ch, children }
    }

    return {
      ...ch,
      children: insertChaptersIntoParent(
        ch.children,
        parentId,
        newChapters,
        index
      ),
    }
  })

// Returns depthof chapter to prevent nesting of nesting
export const maxChapterDepthBelow = (chapter: ChapterNode): number =>
  chapter.children.length === 0
    ? 0
    : 1 + Math.max(...chapter.children.map(maxChapterDepthBelow))

// Helper for ui to count the depth for the current height
export const countChapterRows = (chapters: ChapterNode[]): number =>
  chapters.reduce((sum, ch) => sum + 1 + countChapterRows(ch.children), 0)

// Creates a map of chapters of ids to their parent id. Used to detect which
// chapters changed parent between load and save.
export const chaptersToParentIdMap = (
  chapters: ChapterNode[],
  parentId: string | null = null,
  acc: Map<string, string | null> = new Map()
): Map<string, string | null> => {
  for (const chapter of chapters) {
    if (chapter.id) {
      acc.set(chapter.id, parentId)
      chaptersToParentIdMap(chapter.children, chapter.id, acc)
    } else {
      chaptersToParentIdMap(chapter.children, parentId, acc)
    }
  }
  return acc
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
      // Only unassigned / existing chapters can be added so protetive case if not true
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
      documentId: node.documentId,
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

// Draft Row is a green row that has not been added as a pending chapter yet
export const DraftRow = () => {
  const {
    draftTitle,
    draftSlug,
    availableSlugs,
    onDraftTitleChange,
    onDraftSlugChange,
    onConfirmDraft,
    onCancelDraft,
  } = useEditToc()

  return (
    <div className={css.chapterRow.draft}>
      <div className={css.chapterRowContent}>
        <div className={css.inputsOfRow}>
          <input
            type="text"
            placeholder="Title"
            value={draftTitle}
            onChange={(e) => onDraftTitleChange(e.target.value)}
            className={css.titleInput}
          />
          <select
            value={draftSlug}
            onChange={(e) => onDraftSlugChange(e.target.value)}
            className={css.slugInput}
            disabled={availableSlugs.length === 0}
          >
            <option value="">
              {availableSlugs.length === 0
                ? "No unassigned chapters"
                : "Select a slug..."}
            </option>
            {availableSlugs.map((s) => (
              <option value={s} key={s}>
                {s.replace(/_/g, "-")}
              </option>
            ))}
          </select>
        </div>
        <div className={css.controlsOfRow}>
          <button
            type="button"
            onClick={onConfirmDraft}
            disabled={availableSlugs.length === 0}
            className={css.tocButton.primary}
          >
            Add Chapter
          </button>
          <button
            type="button"
            onClick={onCancelDraft}
            className={css.tocButton.neutral}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// Since now using arborist, this separate component to render a chapter node.
// Node holds the data of the chapter node which is rendered as normal.
// NOTE: aborist is used to address one feature of needing drag and drop into other
// existing chapters to make subchapters. This was not suported by the existing dnd
export const ArboristChapterNode = ({
  node,
  style,
  dragHandle,
}: NodeRendererProps<ChapterNode>) => {
  const chapter = node.data
  const { onOpenDraft, onRemove } = useEditToc()

  const chapterId = idOf(chapter)
  const sectionKey = sectionToKey(chapter.section)
  const isTopLevel = node.level === 0
  const canAddSubchapter = node.level < MAX_CHAPTER_LEVEL

  const rowClassName = [
    chapter.isNew ? css.chapterRow.draft : css.chapterRow.default,
    node.isSelected ? css.selectedRow : "",
  ]
    .filter(Boolean)
    .join(" ")

  const contentClassName = [
    css.chapterRowContent,
    !isTopLevel ? css.nestedChapterContent : "",
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div style={style} className={rowClassName}>
      <div className={contentClassName}>
        <div className={css.inputsOfRow}>
          <span className={css.dragHandle} ref={dragHandle}>
            <MdDragIndicator size={16} />
          </span>
          {!isTopLevel && (
            <span
              title={`Nested ${node.level + 1} levels deep`}
              className={css.nestedBadge}
            >
              ↳
            </span>
          )}
          {chapter.isNew && <span className={css.newBadge}>NEW</span>}
          <input
            type="text"
            placeholder="Title"
            value={chapter.title}
            className={css.titleInput}
            disabled
          />
          <input
            type="text"
            placeholder="Slug"
            value={chapter.slug.replace(/_/g, "-")}
            className={css.slugInput}
            disabled
          />
        </div>
        <div className={css.controlsOfRow}>
          {canAddSubchapter && (
            <button
              type="button"
              onClick={() => onOpenDraft(sectionKey, chapterId)}
              className={css.tocButton.primary}
            >
              + Add Subchapter
            </button>
          )}
          <button
            type="button"
            onClick={() =>
              onRemove(sectionKey, chapterId, chapter.title, !!chapter.isNew)
            }
            className={
              chapter.isNew ? css.tocButton.neutral : css.tocButton.danger
            }
          >
            {chapter.isNew ? "Remove" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  )
}

export const EditableToc = ({ collectionSlug }: { collectionSlug: string }) => {
  const normalizedSlug = collectionSlug.replace(/-/g, "_")

  const [{ data, fetching }, refetch] = Dailp.useEditedCollectionQuery({
    variables: { slug: collectionSlug },
  })
  const collection = data?.editedCollection
  const [, updateOrder] = Dailp.useUpdateCollectionChapterOrderMutation()
  const [, removeChapter] = Dailp.useRemoveCollectionChapterMutation()
  const [, addChapter] = Dailp.useAddCollectionChapterMutation()

  const [{ data: slugData }, refetchSlugs] = Dailp.useAllChapterSlugsQuery({
    variables: { collectionSlug: normalizedSlug },
    requestPolicy: "cache-and-network",
  })

  const [chaptersBySection, setChaptersBySection] = useState<ChaptersBySection>(
    {
      intro: [],
      body: [],
      credit: [],
    }
  )

  // Snapshot of parent referenfces to be used to compare to upadte upon drag
  // such that dragging chapters in and out can create/delete subchapters.
  const originalParentRef = React.useRef<Map<string, string | null>>(new Map())

  const [draftTarget, setDraftTarget] = useState<DraftTarget | null>(null)
  const [draftTitle, setDraftTitle] = useState("")
  const [draftSlug, setDraftSlug] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  // Grabs all pending chapters to find which are available including from qeury
  const pendingChapterSlugs = new Set([
    ...getPendingSlugs(chaptersBySection.intro),
    ...getPendingSlugs(chaptersBySection.body),
    ...getPendingSlugs(chaptersBySection.credit),
  ])

  const availableSlugs = (slugData?.allChapterSlugs ?? [])
    .map((s) => s.slug)
    .filter((slug) => !pendingChapterSlugs.has(slug))

  useEffect(() => {
    if (collection?.chapters) {
      // Build chapters if collection changes
      const built = buildChaptersBySection(collection.chapters as any)
      setChaptersBySection(built)
      originalParentRef.current = new Map([
        ...chaptersToParentIdMap(built.intro),
        ...chaptersToParentIdMap(built.body),
        ...chaptersToParentIdMap(built.credit),
      ])
    }
  }, [collection])

  if (!collection) return null

  // Set where draft row appears
  const openDraft = (sectionKey: SectionKey, parentId: string | null) => {
    setDraftTarget({ sectionKey, parentId })
    setDraftTitle("")
    setDraftSlug("")
  }

  // Set draft to null
  const cancelDraft = () => {
    setDraftTarget(null)
    setDraftTitle("")
    setDraftSlug("")
  }

  // Add draft as pending
  const confirmDraft = () => {
    if (!draftTarget) return

    if (!draftTitle || !draftSlug) {
      setErrorMessage("Title and slug are required fields.")
      return
    }

    if (!slugData?.allChapterSlugs.some((s) => s.slug === draftSlug)) {
      setErrorMessage("Slug must exist with an already existing document.")
      return
    }

    // Colect info for chapter without row and set isNew then set chapters with it at bottom
    const { sectionKey, parentId } = draftTarget
    const sectionEnum =
      sectionKey === "intro"
        ? CollectionSection.Intro
        : sectionKey === "body"
        ? CollectionSection.Body
        : CollectionSection.Credit

    const parent = parentId
      ? getChapterById(chaptersBySection[sectionKey], parentId)
      : null

    const sectionSize = parent
      ? parent.children.length
      : chaptersBySection[sectionKey].length

    const newChapter: ChapterNode = {
      clientId: generateClientId(),
      title: draftTitle,
      slug: draftSlug,
      section: sectionEnum,
      indexInParent: sectionSize + 1,
      path: [],
      children: [],
      isNew: true,
    }

    setChaptersBySection((prev) => ({
      ...prev,
      [sectionKey]: addChapterToSection(prev[sectionKey], newChapter, parentId),
    }))

    setErrorMessage(null)
    cancelDraft()
  }

  // Handles the user movement and updates the order on each move
  const handleMove =
    (sectionKey: SectionKey): MoveHandler<ChapterNode> =>
    ({ dragIds, parentId, index }) => {
      // Guard against a chapter being dropped into itself.
      if (parentId && dragIds.includes(parentId)) return

      setChaptersBySection((prev) => {
        let chapters = prev[sectionKey]

        const dragged: ChapterNode[] = []

        // Accumulate all dragged chapers
        for (const id of dragIds) {
          const found = getChapterById(chapters, id)
          if (found) dragged.push(found)
          chapters = removeNestedChapters(chapters, id)
        }

        if (dragged.length === 0) return prev

        // Add capter into correct spot and update the new indices
        chapters = parentId
          ? insertChaptersIntoParent(chapters, parentId, dragged, index)
          : [...chapters.slice(0, index), ...dragged, ...chapters.slice(index)]

        const newState = { ...prev, [sectionKey]: chapters }
        updateSectionIndices(newState.intro)
        updateSectionIndices(newState.body)
        updateSectionIndices(newState.credit)

        return newState
      })
    }

  // Removes a given chapter row or pending row
  const handleRemove = async (
    section: SectionKey,
    id: string,
    title: string,
    isNew: boolean
  ) => {
    if (isNew) {
      setChaptersBySection((prev) => ({
        ...prev,
        [section]: removeNestedChapters(prev[section], id),
      }))
      return
    }

    if (
      !confirm(
        `Remove "${title}" from the Table of Contents? (The chapter 
        and document will not be deleted)`
      )
    )
      return

    setErrorMessage(null)
    setIsSaving(true)
    const savedState = chaptersBySection

    // Remove from frontend
    setChaptersBySection((prev) => ({
      ...prev,
      [section]: removeNestedChapters(prev[section], id),
    }))

    // Delete from backend, reverting to inital state on error
    try {
      const result = await removeChapter({ chapterId: id })
      if (result.error) {
        setChaptersBySection(savedState)
        setErrorMessage("Delete failed due to an unexpected error.")
      } else {
        await refetchSlugs()
        setErrorMessage(null)
      }
    } catch (error: any) {
      setChaptersBySection(savedState)
      setErrorMessage("Delete failed due to an unexpected error.")
    } finally {
      setIsSaving(false)
    }
  }

  // Saves the current state: adds new chapters to backend and updates indices
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage(null)

    if (draftTarget) {
      setErrorMessage("You cannot save with an opened draft chapter.")
      return
    }

    setIsSaving(true)
    try {
      // Track the current parents to then compare to new parents if a chapter
      // was dragged into another chapter or out of one to then delete then readd.
      const currentParents = new Map([
        ...chaptersToParentIdMap(chaptersBySection.intro),
        ...chaptersToParentIdMap(chaptersBySection.body),
        ...chaptersToParentIdMap(chaptersBySection.credit),
      ])

      // For each chapter that was moved by dragging into new chapter, update its
      // position by removing and then adding again
      for (const [chapterId, newParentId] of currentParents) {
        const hadOriginalParent = originalParentRef.current.has(chapterId)
        const originalParentId =
          originalParentRef.current.get(chapterId) ?? null

        if (!hadOriginalParent || originalParentId === newParentId) continue

        const chapter =
          getChapterById(chaptersBySection.intro, chapterId) ||
          getChapterById(chaptersBySection.body, chapterId) ||
          getChapterById(chaptersBySection.credit, chapterId)

        if (!chapter) continue

        const removeResult = await removeChapter({ chapterId })
        if (removeResult.error) {
          setErrorMessage(
            `Failed to move "${chapter.title}" to its new parent.`
          )
          return
        }

        const addResult = await addChapter({
          input: {
            id: chapterId,
            collectionSlug: normalizedSlug,
            title: chapter.title,
            slug: chapter.slug,
            section: chapter.section,
            parentId: newParentId,
            documentId: chapter.documentId ?? null,
          },
        })

        if (addResult.error) {
          setErrorMessage(
            `Failed to move "${chapter.title}" to its new parent.`
          )
          return
        }
      }

      // For each sesction, add pending chapters or throw on fail
      const introResult = await addPendingChapters(
        chaptersBySection.intro,
        CollectionSection.Intro,
        addChapter,
        slugData,
        normalizedSlug
      )
      if (introResult.error) {
        setErrorMessage("Failed to save the Intro section.")
        return
      }

      const bodyResult = await addPendingChapters(
        chaptersBySection.body,
        CollectionSection.Body,
        addChapter,
        slugData,
        normalizedSlug
      )
      if (bodyResult.error) {
        setErrorMessage("Failed to save the Body section.")
        return
      }

      const creditResult = await addPendingChapters(
        chaptersBySection.credit,
        CollectionSection.Credit,
        addChapter,
        slugData,
        normalizedSlug
      )
      if (creditResult.error) {
        setErrorMessage("Failed to save the Credit section.")
        return
      }

      // Then update the local state, update the indices to prep for db save
      const updatedSections = {
        intro: introResult.updated,
        body: bodyResult.updated,
        credit: creditResult.updated,
      }
      updateSectionIndices(updatedSections.intro)
      updateSectionIndices(updatedSections.body)
      updateSectionIndices(updatedSections.credit)
      setChaptersBySection(updatedSections)

      const chapters: Dailp.ChapterOrderInput[] = [
        ...ChaptersToOrderInput(updatedSections.intro, CollectionSection.Intro),
        ...ChaptersToOrderInput(updatedSections.body, CollectionSection.Body),
        ...ChaptersToOrderInput(
          updatedSections.credit,
          CollectionSection.Credit
        ),
      ]

      if (chapters.length === 0) {
        setErrorMessage("No chapters to save.")
        return
      }

      const result = await updateOrder({ input: { collectionSlug, chapters } })

      if (result.error) {
        setErrorMessage("Save failed due to an unexpected error.")
        return
      }

      await refetch()
      await refetchSlugs()
      setErrorMessage(null)
    } catch (error: any) {
      setErrorMessage("Save failed due to an unexpected error.")
    } finally {
      setIsSaving(false)
    }
  }

  const addChapterInformation = `Only existing chapters not yet present in the TOC 
    can be added (prevents duplicate chapters). Deleting a chapter will allow its 
    slug to be used elsewhere in this TOC.`

  return (
    <EditTocProvider
      value={{
        draftTarget,
        draftTitle,
        draftSlug,
        availableSlugs,
        onDraftTitleChange: setDraftTitle,
        onDraftSlugChange: setDraftSlug,
        onConfirmDraft: confirmDraft,
        onCancelDraft: cancelDraft,
        onOpenDraft: openDraft,
        onRemove: handleRemove,
      }}
    >
      <Sidebar
        isPreview={true}
        alternateContent={<PreviewToc chaptersBySection={chaptersBySection} />}
      />
      <div className={css.tocContainer}>
        <div className={css.headerContainer}>
          <h2 className={css.collectionTitle}>{collection.title}</h2>
          <InfoTooltip content={addChapterInformation} />
        </div>
        <div className={css.editorContent}>
          {errorMessage && (
            <div className={css.errorBanner}>{errorMessage}</div>
          )}
          <div className={css.sectionsGrid}>
            {(["intro", "body", "credit"] as const).map((sectionKey) => {
              const sectionName =
                sectionKey === "intro"
                  ? "Intro"
                  : sectionKey === "body"
                  ? "Body"
                  : "Credit"

              const chapters = chaptersBySection[sectionKey]

              const hasDraftInSection = draftTarget?.sectionKey === sectionKey
              const draftParentChapter =
                hasDraftInSection && draftTarget?.parentId
                  ? getChapterById(chapters, draftTarget.parentId)
                  : null

              // Arbitrary visual computations for start, min, max height based on visual testing
              const ROW_HEIGHT = 64
              const treeHeight = countChapterRows(chapters) * ROW_HEIGHT

              return (
                <div key={sectionKey}>
                  <h3 className={css.sectionHeading}>{sectionName}</h3>
                  <div className={css.sectionPanel}>
                    {
                      // Tree of chapter node used to render the new arborist nodes
                    }
                    <Tree<ChapterNode>
                      data={chapters}
                      onMove={handleMove(sectionKey)}
                      onCreate={() => null}
                      onRename={() => {}}
                      onDelete={() => {}}
                      idAccessor={(d) => idOf(d)}
                      childrenAccessor="children"
                      disableEdit
                      disableDrop={({ parentNode, dragNodes }) => {
                        const targetDepth = parentNode.level + 1
                        return dragNodes.some(
                          (n) =>
                            targetDepth + maxChapterDepthBelow(n.data) >
                            MAX_CHAPTER_LEVEL
                        )
                      }}
                      width="100%"
                      height={treeHeight}
                      rowHeight={ROW_HEIGHT}
                      indent={20}
                      openByDefault
                    >
                      {ArboristChapterNode}
                    </Tree>
                  </div>
                  {
                    // Couldn't find way to use arborist and make "create new" nodes appear
                    // bellow a chapter since it is just a visual node and instead renders
                    // it at the bottom of the section.
                    hasDraftInSection && (
                      <div className={css.draftBox}>
                        {draftParentChapter && (
                          <p className={css.draftParentLabel}>
                            Adding subchapter to:{" "}
                            <strong>{draftParentChapter.title}</strong>
                          </p>
                        )}
                        <ul className={css.chapterList}>
                          <DraftRow />
                        </ul>
                      </div>
                    )
                  }
                  <button
                    type="button"
                    onClick={() => openDraft(sectionKey, null)}
                    className={css.tocButton.primary}
                  >
                    + Add Chapter
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <form onSubmit={handleSave} className={css.saveRow}>
        <button
          type="submit"
          disabled={isSaving || fetching || !!draftTarget}
          className={
            isSaving || fetching || draftTarget
              ? css.tocButton.neutral
              : css.tocButton.primary
          }
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => setIsResetting(true)}
          disabled={isSaving || fetching}
          className={css.tocButton.neutral}
        >
          Reset
        </button>
        <ConfirmationPopup
          PopupText="Are you sure you want to reset your changes?"
          actionName="Confirm"
          isPopupShowing={isResetting}
          toggleVisibility={() => setIsResetting((p) => !p)}
          action={() => {
            if (collection?.chapters)
              setChaptersBySection(
                buildChaptersBySection(collection.chapters as any)
              )
            cancelDraft()
          }}
        />
      </form>
    </EditTocProvider>
  )
}
