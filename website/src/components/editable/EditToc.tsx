import React, { useEffect, useState } from "react"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import { MdDragIndicator } from "react-icons/md/index"
import * as Dailp from "src/graphql/dailp"
import { CollectionSection } from "src/graphql/dailp"

// Stable identifiers for items: prefer backend id, then clientId
const idOf = (n: any): string => {
  if (!n) return ""
  const persistedId = n?.id != null ? String(n.id) : ""
  const clientId = n?.clientId != null ? String(n.clientId) : ""
  return persistedId || clientId
}

const generateId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2)}`

// Convert CollectionSection enum to lowercase key
const sectionToKey = (
  section: CollectionSection
): "intro" | "body" | "credit" => {
  if (section === CollectionSection.Intro) return "intro"
  if (section === CollectionSection.Body) return "body"
  if (section === CollectionSection.Credit) return "credit"
  return "body" // default fallback
}

// Build nested chapter structure with subchapters
type ChapterNode = {
  id?: string
  clientId?: string
  title: string
  slug: string
  section: CollectionSection
  indexInParent: number
  path: string[]
  children: ChapterNode[]
}

const buildNestedStructure = (
  nodes: readonly any[] | undefined
): {
  intro: ChapterNode[]
  body: ChapterNode[]
  credit: ChapterNode[]
} => {
  if (!nodes) return { intro: [], body: [], credit: [] }

  const nodesWithIds = (nodes ?? []).map((n) => ({
    ...n,
    clientId: idOf(n) || generateId(),
  }))

  // Sort by depth first, then by indexInParent
  const sorted = [...nodesWithIds].sort((a, b) => {
    const depthDiff = (a?.path?.length ?? 0) - (b?.path?.length ?? 0)
    if (depthDiff !== 0) return depthDiff
    return (a?.indexInParent ?? 0) - (b?.indexInParent ?? 0)
  })

  // Build a map of slug to chapter node
  const slugToNode = new Map<string, ChapterNode>()
  const topLevel: {
    intro: ChapterNode[]
    body: ChapterNode[]
    credit: ChapterNode[]
  } = { intro: [], body: [], credit: [] }

  for (const node of sorted) {
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

    // Get parent slug (second-to-last in path)
    const parentSlug =
      node.path && node.path.length > 1
        ? node.path[node.path.length - 2]
        : undefined

    if (parentSlug) {
      const parent = slugToNode.get(parentSlug)
      if (parent) {
        parent.children.push(chapter)
      } else {
        // Parent not found yet, add to top level
        const sectionKey = sectionToKey(node.section)
        topLevel[sectionKey].push(chapter)
      }
    } else {
      // Top-level chapter (path.length === 2)
      const sectionKey = sectionToKey(node.section)
      topLevel[sectionKey].push(chapter)
    }
  }

  // Sort each section's chapters and their children recursively
  const sortRecursive = (chapters: ChapterNode[]): ChapterNode[] => {
    return chapters
      .sort((a, b) => a.indexInParent - b.indexInParent)
      .map((ch) => ({
        ...ch,
        children: sortRecursive(ch.children),
      }))
  }

  return {
    intro: sortRecursive(topLevel.intro),
    body: sortRecursive(topLevel.body),
    credit: sortRecursive(topLevel.credit),
  }
}

export const EditableToc = ({ collectionSlug }: { collectionSlug: string }) => {
  const [{ data, fetching }, refetch] = Dailp.useEditedCollectionQuery({
    variables: { slug: collectionSlug },
  })
  const collection = data?.editedCollection
  const [, updateOrder] = Dailp.useUpdateCollectionChapterOrderMutation()
  // @ts-ignore - Types will be generated when GraphQL schema is regenerated
  const [, removeChapter] = Dailp.useRemoveCollectionChapterMutation()
  const [, addDocument] = Dailp.useAddDocumentMutation()
  const [, upsertChapter] = Dailp.useUpsertEditedCollectionMutation()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [chaptersBySection, setChaptersBySection] = useState<{
    intro: ChapterNode[]
    body: ChapterNode[]
    credit: ChapterNode[]
  }>({
    intro: [],
    body: [],
    credit: [],
  })
  const [collectionTitle, setCollectionTitle] = useState(
    collection?.title ?? "no name"
  )
  const [collectionDescription, setCollectionDescription] = useState("")

  // Sync editable items when collection loads/changes
  useEffect(() => {
    if (collection?.chapters) {
      setChaptersBySection(buildNestedStructure(collection.chapters as any))
    }
    setCollectionTitle(collection?.title ?? "no name")
  }, [collection, data])

  if (!collection) {
    return null
  }

  // Helper to update indices after reordering
  const updateIndices = (chapters: ChapterNode[]): void => {
    chapters.forEach((ch, idx) => {
      ch.indexInParent = idx + 1
      updateIndices(ch.children)
    })
  }

  // Simple reorder function - moves item from startIndex to endIndex within same array
  const reorder = (
    list: ChapterNode[],
    startIndex: number,
    endIndex: number
  ): ChapterNode[] => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    if (!removed) return result
    result.splice(endIndex, 0, removed)
    return result
  }

  // Helper to update a parent's children in a nested structure
  const updateParentChildren = (
    chapters: ChapterNode[],
    parentId: string,
    newChildren: ChapterNode[]
  ): ChapterNode[] => {
    return chapters.map((ch) => {
      if (idOf(ch) === parentId) {
        return { ...ch, children: newChildren }
      }
      return {
        ...ch,
        children: updateParentChildren(ch.children, parentId, newChildren),
      }
    })
  }

  const handleDragEnd = (result: any) => {
    const { source, destination, type } = result
    if (!destination) return

    // Disallow cross-droppable moves
    if (source.droppableId !== destination.droppableId) return

    // Handle top-level chapters
    if (type === "SECTION_CHAPTERS") {
      const sectionKey = source.droppableId as keyof typeof chaptersBySection
      setChaptersBySection((prev) => {
        const reordered = reorder(
          prev[sectionKey],
          source.index,
          destination.index
        )
        const newState = {
          ...prev,
          [sectionKey]: reordered,
        }
        updateIndices(newState.intro)
        updateIndices(newState.body)
        updateIndices(newState.credit)
        return newState
      })
      return
    }

    // Handle nested items - type is the parent's chapterId
    const parentId = type
    const sectionKey = source.droppableId.split(
      ":"
    )[0] as keyof typeof chaptersBySection

    setChaptersBySection((prev) => {
      const sectionChapters = prev[sectionKey]
      const parent = findChapterInNested(sectionChapters, parentId)
      if (!parent) return prev

      const reordered = reorder(
        parent.children,
        source.index,
        destination.index
      )
      const updatedSection = updateParentChildren(
        sectionChapters,
        parentId,
        reordered
      )

      const newState = {
        ...prev,
        [sectionKey]: updatedSection,
      }

      updateIndices(newState.intro)
      updateIndices(newState.body)
      updateIndices(newState.credit)

      return newState
    })
  }

  // Helper to find a chapter in nested structure
  const findChapterInNested = (
    chapters: ChapterNode[],
    chapterId: string
  ): ChapterNode | undefined => {
    for (const ch of chapters) {
      if (idOf(ch) === chapterId) return ch
      const found = findChapterInNested(ch.children, chapterId)
      if (found) return found
    }
    return undefined
  }

  // Flatten nested structure to collect all chapters
  const flattenChapters = (
    chapters: ChapterNode[],
    section: CollectionSection
  ): Dailp.ChapterOrderInput[] => {
    const result: Dailp.ChapterOrderInput[] = []
    for (const chapter of chapters) {
      if (chapter.id) {
        result.push({
          id: chapter.id,
          indexInParent: chapter.indexInParent,
          section: section,
        })
      }
      // Recursively add children
      result.push(...flattenChapters(chapter.children, section))
    }
    return result
  }

  // Flatten nested structure to collect all chapters with full data for upsert
  const flattenChaptersForUpsert = (
    chapters: ChapterNode[],
    section: CollectionSection
  ): Array<{
    id: string
    title: string
    slug: string
    section: CollectionSection
    indexInParent: number
  }> => {
    const result: Array<{
      id: string
      title: string
      slug: string
      section: CollectionSection
      indexInParent: number
    }> = []
    for (const chapter of chapters) {
      if (chapter.id) {
        result.push({
          id: chapter.id,
          title: chapter.title,
          slug: chapter.slug,
          section: section,
          indexInParent: chapter.indexInParent,
        })
      }
      // Recursively add children
      result.push(...flattenChaptersForUpsert(chapter.children, section))
    }
    return result
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage(null)
    setIsSaving(true)

    // Collect current input values from DOM to ensure we have the latest edits
    // This handles the case where user edits but doesn't blur before clicking save
    const inputUpdates = new Map<string, { title?: string; slug?: string }>()

    // Find all title and slug inputs with their chapter IDs from data attributes
    const titleInputs = document.querySelectorAll<HTMLInputElement>(
      'input[data-chapter-id][data-field="title"]'
    )
    const slugInputs = document.querySelectorAll<HTMLInputElement>(
      'input[data-chapter-id][data-field="slug"]'
    )

    titleInputs.forEach((input) => {
      const chapterId = input.getAttribute("data-chapter-id")
      if (chapterId) {
        const current = inputUpdates.get(chapterId) || {}
        inputUpdates.set(chapterId, { ...current, title: input.value })
      }
    })

    slugInputs.forEach((input) => {
      const chapterId = input.getAttribute("data-chapter-id")
      if (chapterId) {
        const current = inputUpdates.get(chapterId) || {}
        inputUpdates.set(chapterId, { ...current, slug: input.value })
      }
    })

    // Update state with current input values for UI consistency
    if (inputUpdates.size > 0) {
      setChaptersBySection((prev) => {
        const updated = { ...prev }
        ;(["intro", "body", "credit"] as const).forEach((sectionKey) => {
          updated[sectionKey] = updateChaptersFromInputs(
            prev[sectionKey],
            inputUpdates
          )
        })
        return updated
      })
    }

    try {
      // Apply input updates directly to chapters for saving (since state updates are async)
      const chaptersWithUpdates =
        inputUpdates.size > 0
          ? {
              intro: updateChaptersFromInputs(
                chaptersBySection.intro,
                inputUpdates
              ),
              body: updateChaptersFromInputs(
                chaptersBySection.body,
                inputUpdates
              ),
              credit: updateChaptersFromInputs(
                chaptersBySection.credit,
                inputUpdates
              ),
            }
          : chaptersBySection

      // Collect all chapters from all sections (including subchapters) for order update
      const chapters: Dailp.ChapterOrderInput[] = []

      chapters.push(
        ...flattenChapters(chaptersWithUpdates.intro, CollectionSection.Intro)
      )
      chapters.push(
        ...flattenChapters(chaptersWithUpdates.body, CollectionSection.Body)
      )
      chapters.push(
        ...flattenChapters(chaptersWithUpdates.credit, CollectionSection.Credit)
      )

      if (chapters.length === 0) {
        setErrorMessage("No chapters to save. Please add chapters first.")
        setIsSaving(false)
        return
      }

      // Collect all chapters with full data for title/slug updates
      // Use chaptersWithUpdates to ensure we have the latest input values
      const chaptersForUpsert = [
        ...flattenChaptersForUpsert(
          chaptersWithUpdates.intro,
          CollectionSection.Intro
        ),
        ...flattenChaptersForUpsert(
          chaptersWithUpdates.body,
          CollectionSection.Body
        ),
        ...flattenChaptersForUpsert(
          chaptersWithUpdates.credit,
          CollectionSection.Credit
        ),
      ]

      // Update chapter titles (slug updates require chapter_path changes which aren't supported by upsert)
      // Only update chapters that have valid IDs (existing chapters from the database)
      for (const chapter of chaptersForUpsert) {
        // Skip chapters without valid IDs - they shouldn't exist but be defensive
        if (!chapter.id) {
          console.warn("Skipping chapter without ID:", chapter)
          continue
        }

        const upsertResult = await upsertChapter({
          input: {
            id: chapter.id,
            title: chapter.title || null,
            section: chapter.section,
            indexInParent: chapter.indexInParent,
            description: null as Dailp.InputMaybe<string>,
            thumbnailUrl: null as Dailp.InputMaybe<string>,
            slug: chapter.slug || null,
          },
        })

        if (upsertResult.error) {
          setErrorMessage(
            upsertResult.error.message || "Failed to save chapter updates"
          )
          setIsSaving(false)
          return
        }
      }

      // Update chapter order
      const result = await updateOrder({
        input: {
          collectionSlug: collectionSlug,
          chapters: chapters,
        },
      })

      if (result.error) {
        setErrorMessage(result.error.message || "Failed to save chapter order")
      } else {
        // Refetch the collection to get updated data
        await refetch()
        setErrorMessage(null)
      }
    } catch (error: any) {
      setErrorMessage(error.message || "An unexpected error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddNewChapter = async (
    e: React.FormEvent<HTMLFormElement>,
    parentId?: string | null,
    sectionKey?: keyof typeof chaptersBySection
  ) => {
    e.preventDefault()
    setErrorMessage(null)
    setIsSaving(true)

    // Save previous state for potential rollback (declared outside try for catch access)
    let previousState: typeof chaptersBySection | null = null

    try {
      const formData = new FormData(e.target as HTMLFormElement)
      const title = formData.get("chapter title") as string
      const slug = formData.get("chapter slug") as string
      const section = (sectionKey ||
        formData.get("chapter section")) as keyof typeof chaptersBySection

      if (!title || !slug) {
        setErrorMessage("Title and slug are required")
        setIsSaving(false)
        return
      }

      if (!collection?.id) {
        setErrorMessage("Collection ID is missing")
        setIsSaving(false)
        return
      }

      // Convert section key to CollectionSection enum
      const sectionEnum =
        section === "intro"
          ? CollectionSection.Intro
          : section === "body"
          ? CollectionSection.Body
          : CollectionSection.Credit

      // Save previous state for potential rollback
      previousState = chaptersBySection

      // Create optimistic chapter node
      const optimisticChapter: ChapterNode = {
        clientId: generateId(), // Temporary ID until backend assigns real one
        title: title,
        slug: slug,
        section: sectionEnum,
        indexInParent: 0, // Will be set correctly by backend
        path: [], // Will be set correctly by backend
        children: [],
      }

      // Optimistically add to UI for immediate feedback
      setChaptersBySection((prev) => ({
        ...prev,
        [section]: addChapterToNested(
          prev[section],
          optimisticChapter,
          parentId || null
        ),
      }))

      // Create document (which also creates the chapter automatically)
      const documentResult = await addDocument({
        input: {
          documentName: title,
          rawTextLines: [[]], // Empty document - can be edited later
          englishTranslationLines: [[]], // Empty translation - can be edited later
          unresolvedWords: [],
          sourceName: "Manual Entry",
          sourceUrl: "",
          collectionId: collection.id,
          section: sectionEnum,
        },
      })

      if (documentResult.error) {
        // Revert optimistic update on error
        setChaptersBySection(previousState)
        setErrorMessage(
          documentResult.error.message || "Failed to create document"
        )
        setIsSaving(false)
        return
      }

      // Refetch to get the real chapter data with correct IDs
      await refetch()
      setErrorMessage(null)
      ;(e.target as HTMLFormElement).reset()
    } catch (error: any) {
      // Revert optimistic update on unexpected error
      // Note: previousState is only defined if we got past document creation
      if (previousState) {
        setChaptersBySection(previousState)
      }
      setErrorMessage(error.message || "An unexpected error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  // Recursive function to update a chapter in nested structure
  const updateChapterInNested = (
    chapters: ChapterNode[],
    chapterId: string,
    update: Partial<ChapterNode>
  ): ChapterNode[] => {
    return chapters.map((ch) => {
      if (idOf(ch) === chapterId) {
        return { ...ch, ...update }
      }
      return {
        ...ch,
        children: updateChapterInNested(ch.children, chapterId, update),
      }
    })
  }

  // Recursive function to update chapters from input values map
  const updateChaptersFromInputs = (
    chapters: ChapterNode[],
    inputUpdates: Map<string, { title?: string; slug?: string }>
  ): ChapterNode[] => {
    return chapters.map((ch) => {
      const chapterId = idOf(ch)
      const updates = inputUpdates.get(chapterId)
      const updatedChapter = updates
        ? {
            ...ch,
            ...(updates.title !== undefined && { title: updates.title }),
            ...(updates.slug !== undefined && { slug: updates.slug }),
          }
        : ch
      return {
        ...updatedChapter,
        children: updateChaptersFromInputs(
          updatedChapter.children,
          inputUpdates
        ),
      }
    })
  }

  // Recursive function to remove a chapter from nested structure
  const removeChapterFromNested = (
    chapters: ChapterNode[],
    chapterId: string
  ): ChapterNode[] => {
    return chapters
      .filter((ch) => idOf(ch) !== chapterId)
      .map((ch) => ({
        ...ch,
        children: removeChapterFromNested(ch.children, chapterId),
      }))
  }

  // Helper function to add a chapter optimistically to nested structure
  const addChapterToNested = (
    chapters: ChapterNode[],
    newChapter: ChapterNode,
    parentId: string | null
  ): ChapterNode[] => {
    if (!parentId) {
      // Add to top level
      return [...chapters, newChapter]
    }
    // Find parent and add as child
    return chapters.map((ch) => {
      if (idOf(ch) === parentId) {
        return {
          ...ch,
          children: [...ch.children, newChapter],
        }
      }
      return {
        ...ch,
        children: addChapterToNested(ch.children, newChapter, parentId),
      }
    })
  }

  const handleRemove = async (
    section: keyof typeof chaptersBySection,
    id: string,
    title: string
  ) => {
    const ok = confirm(
      `Remove ${title} from this collection? (The chapter and document will not be deleted)`
    )
    if (!ok) return

    setErrorMessage(null)
    setIsSaving(true)

    // Optimistically remove from UI for immediate feedback
    const previousState = chaptersBySection
    setChaptersBySection((prev) => ({
      ...prev,
      [section]: removeChapterFromNested(prev[section], id),
    }))

    try {
      const result = await removeChapter({ chapterId: id })

      if (result.error) {
        // Revert optimistic update on error
        setChaptersBySection(previousState)
        setErrorMessage(result.error.message || "Failed to remove chapter")
      } else {
        // Refetch the collection to ensure consistency with backend
        await refetch()
        // The useEffect will automatically update chaptersBySection when data/collection changes
        setErrorMessage(null)
      }
    } catch (error: any) {
      // Revert optimistic update on error
      setChaptersBySection(previousState)
      setErrorMessage(error.message || "An unexpected error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdate = (
    section: keyof typeof chaptersBySection,
    id: string,
    update: Partial<ChapterNode>
  ) => {
    setChaptersBySection((prev) => ({
      ...prev,
      [section]: updateChapterInNested(prev[section], id, update),
    }))
  }

  // Recursive component to render a chapter and its children
  const ChapterItem = ({
    chapter,
    index,
    sectionKey,
    parentId,
    depth = 0,
  }: {
    chapter: ChapterNode
    index: number
    sectionKey: keyof typeof chaptersBySection
    parentId: string | null
    depth?: number
  }) => {
    const chapterId = idOf(chapter)
    const isTopLevel = depth === 0
    const [localTitle, setLocalTitle] = useState(chapter.title ?? "")
    const [localSlug, setLocalSlug] = useState(chapter.slug ?? "")

    // Sync local state when chapter prop changes (but not from our own updates)
    useEffect(() => {
      setLocalTitle(chapter.title ?? "")
      setLocalSlug(chapter.slug ?? "")
    }, [chapter.id, chapter.clientId])

    return (
      <Draggable key={chapterId} draggableId={chapterId} index={index}>
        {(provided, snapshot) => (
          <li
            ref={provided.innerRef}
            {...provided.draggableProps}
            style={{
              ...provided.draggableProps.style,
              listStyle: "none",
              margin: "6px 0",
              background: snapshot.isDragging ? "#fafafa" : undefined,
              borderRadius: 6,
              padding: 8,
              border: "1px solid #e0e0e0",
              touchAction: "manipulation",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                flexWrap: "wrap",
              }}
              {...provided.dragHandleProps}
            >
              <span style={{ color: "#666", cursor: "grab" }}>
                <MdDragIndicator size={18} />
              </span>
              {!isTopLevel && (
                <span style={{ color: "#999", fontSize: 12 }}>↳</span>
              )}
              <input
                type="text"
                placeholder="Title"
                data-chapter-id={chapterId}
                data-field="title"
                value={localTitle}
                onChange={(e) => setLocalTitle(e.target.value)}
                onBlur={() =>
                  handleUpdate(sectionKey, chapterId, {
                    title: localTitle,
                  })
                }
                style={{
                  width: 200,
                  height: 32,
                  padding: "4px 8px",
                  border: "1px solid #ddd",
                  borderRadius: 4,
                  fontSize: 14,
                }}
              />
              <input
                type="text"
                placeholder="Slug"
                data-chapter-id={chapterId}
                data-field="slug"
                value={localSlug}
                onChange={(e) => setLocalSlug(e.target.value)}
                onBlur={() =>
                  handleUpdate(sectionKey, chapterId, {
                    slug: localSlug,
                  })
                }
                style={{
                  width: 150,
                  height: 32,
                  padding: "4px 8px",
                  border: "1px solid #ddd",
                  borderRadius: 4,
                  fontSize: 14,
                }}
              />
              <button
                type="button"
                onClick={() =>
                  handleRemove(sectionKey, chapterId, chapter.title)
                }
                style={{
                  padding: "6px 12px",
                  fontSize: 12,
                  background: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
            {chapter.children.length > 0 && (
              <Droppable
                droppableId={`${sectionKey}:${chapterId}`}
                type={`${chapterId}`}
                direction="vertical"
              >
                {(dropProvided) => (
                  <ul
                    ref={dropProvided.innerRef}
                    {...dropProvided.droppableProps}
                    style={{
                      listStyle: "none",
                      paddingLeft: 24,
                      marginTop: 8,
                      minHeight: 12,
                    }}
                  >
                    {chapter.children.map((child, childIndex) => (
                      <ChapterItem
                        key={idOf(child)}
                        chapter={child}
                        index={childIndex}
                        sectionKey={sectionKey}
                        parentId={chapterId}
                        depth={depth + 1}
                      />
                    ))}
                    {dropProvided.placeholder}
                  </ul>
                )}
              </Droppable>
            )}
          </li>
        )}
      </Draggable>
    )
  }

  return (
    <>
      <div
        style={{
          marginBottom: 24,
          padding: 16,
          border: "1px solid #e0e0e0",
          borderRadius: 8,
          background: "#fafafa",
        }}
      >
        <h5 style={{ marginTop: 0, marginBottom: 12 }}>Collection Details</h5>
        <input
          type="text"
          name="collection title"
          placeholder="Collection Title"
          value={collectionTitle}
          onChange={(e) => setCollectionTitle(e.target.value)}
          style={{
            width: "100%",
            marginBottom: 12,
            padding: "10px 12px",
            border: "1px solid #ddd",
            borderRadius: 4,
            fontSize: 14,
          }}
        />
        <textarea
          name="collection description"
          placeholder="Description"
          value={collectionDescription}
          onChange={(e) => setCollectionDescription(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            border: "1px solid #ddd",
            borderRadius: 4,
            fontSize: 14,
            minHeight: 80,
            resize: "vertical",
          }}
        />
      </div>
      <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 8 }}>
        <h4 style={{ marginTop: 0, marginBottom: 16 }}>
          Table of Contents Editor
        </h4>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 20,
            }}
          >
            {(["intro", "body", "credit"] as const).map((sectionKey) => {
              const sectionName =
                sectionKey === "intro"
                  ? "Intro"
                  : sectionKey === "body"
                  ? "Body"
                  : "Credit"
              const chapters = chaptersBySection[sectionKey]
              return (
                <div key={sectionKey}>
                  <h5 style={{ marginTop: 0, marginBottom: 12, fontSize: 16 }}>
                    {sectionName}
                  </h5>
                  <div
                    style={{
                      border: "1px solid #e0e0e0",
                      padding: 12,
                      borderRadius: 6,
                      background: "#fafafa",
                      minHeight: 100,
                      maxHeight: "60vh",
                      overflowY: "auto",
                    }}
                  >
                    <Droppable
                      droppableId={sectionKey}
                      type="SECTION_CHAPTERS"
                      direction="vertical"
                    >
                      {(provided) => (
                        <ul
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          style={{
                            listStyle: "none",
                            padding: 0,
                            margin: 0,
                            minHeight: 40,
                          }}
                        >
                          {chapters.map((chapter, index) => (
                            <ChapterItem
                              key={idOf(chapter)}
                              chapter={chapter}
                              index={index}
                              sectionKey={sectionKey}
                              parentId={null}
                              depth={0}
                            />
                          ))}
                          {provided.placeholder}
                        </ul>
                      )}
                    </Droppable>
                  </div>
                </div>
              )
            })}
          </div>
        </DragDropContext>
      </div>
      <div style={{ marginTop: 24 }}>
        <h5 style={{ marginBottom: 12 }}>Add New Chapter</h5>
        <form
          onSubmit={handleAddNewChapter}
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          {errorMessage && (
            <div
              style={{
                width: "100%",
                color: "#b00020",
                marginBottom: 8,
                padding: 8,
                background: "#ffebee",
                borderRadius: 4,
              }}
            >
              {errorMessage}
            </div>
          )}
          <input
            type="text"
            name="chapter title"
            placeholder="Chapter Title"
            required
            style={{
              padding: "8px 12px",
              border: "1px solid #ddd",
              borderRadius: 4,
              fontSize: 14,
              minWidth: 180,
            }}
          />
          <input
            type="text"
            name="chapter slug"
            placeholder="Chapter Slug"
            required
            style={{
              padding: "8px 12px",
              border: "1px solid #ddd",
              borderRadius: 4,
              fontSize: 14,
              minWidth: 150,
            }}
          />
          <select
            name="chapter section"
            style={{
              padding: "8px 12px",
              border: "1px solid #ddd",
              borderRadius: 4,
              fontSize: 14,
              minWidth: 120,
            }}
          >
            <option value="intro">Intro</option>
            <option value="body">Body</option>
            <option value="credit">Credit</option>
          </select>
          <button
            type="submit"
            style={{
              padding: "8px 16px",
              background: "#28a745",
              color: "white",
              border: "none",
              borderRadius: 4,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Add Chapter
          </button>
        </form>
        <form
          onSubmit={handleSave}
          style={{ display: "flex", gap: 8, alignItems: "center" }}
        >
          <button
            type="submit"
            disabled={isSaving || fetching}
            style={{
              padding: "10px 20px",
              background: isSaving || fetching ? "#6c757d" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: 4,
              fontSize: 14,
              cursor: isSaving || fetching ? "not-allowed" : "pointer",
            }}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() =>
              collection?.chapters &&
              setChaptersBySection(
                buildNestedStructure(collection.chapters as any)
              )
            }
            disabled={isSaving || fetching}
            style={{
              padding: "10px 20px",
              background: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: 4,
              fontSize: 14,
              cursor: isSaving || fetching ? "not-allowed" : "pointer",
            }}
          >
            Reset
          </button>
        </form>
      </div>
    </>
  )
}
