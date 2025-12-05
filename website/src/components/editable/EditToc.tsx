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
  const [, addChapter] = Dailp.useAddCollectionChapterMutation()
  // @ts-ignore - Types will be generated when GraphQL schema is regenerated
  const [, removeChapter] = Dailp.useRemoveCollectionChapterMutation()
  const [, addDocument] = Dailp.useAddDocumentMutation()
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
  // State for showing "Add Subchapter" form
  const [showAddSubchapter, setShowAddSubchapter] = useState<string | null>(
    null
  )

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

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage(null)
    setIsSaving(true)

    try {
      // Collect all chapters from all sections (including subchapters)
      const chapters: Dailp.ChapterOrderInput[] = []

      chapters.push(
        ...flattenChapters(chaptersBySection.intro, CollectionSection.Intro)
      )
      chapters.push(
        ...flattenChapters(chaptersBySection.body, CollectionSection.Body)
      )
      chapters.push(
        ...flattenChapters(chaptersBySection.credit, CollectionSection.Credit)
      )

      if (chapters.length === 0) {
        setErrorMessage("No chapters to save. Please add chapters first.")
        setIsSaving(false)
        return
      }

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

      // First, create a document for this chapter
      const documentResult = await addDocument({
        input: {
          documentName: title,
          rawTextLines: [[]], // Empty document - can be edited later
          englishTranslationLines: [[]], // Empty translation - can be edited later
          unresolvedWords: [],
          sourceName: "Manual Entry",
          sourceUrl: "",
          collectionId: collection.id,
        },
      })

      if (documentResult.error) {
        setErrorMessage(
          documentResult.error.message || "Failed to create document"
        )
        setIsSaving(false)
        return
      }

      const documentId = documentResult.data?.addDocument?.id
      if (!documentId) {
        setErrorMessage("Failed to get document ID from creation")
        setIsSaving(false)
        return
      }

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

      // Then, create the chapter linked to the document
      const result = await addChapter({
        input: {
          collectionSlug: collectionSlug,
          title: title,
          slug: slug,
          section: sectionEnum,
          parentId: parentId ? (parentId as any) : null,
          documentId: documentId,
        },
      })

      if (result.error) {
        // Revert optimistic update on error
        setChaptersBySection(previousState)
        setErrorMessage(result.error.message || "Failed to add chapter")
      } else {
        // Refetch the collection to get updated data with the new chapter (with real IDs)
        await refetch()
        // The useEffect will automatically update chaptersBySection when data/collection changes
        setErrorMessage(null)
        ;(e.target as HTMLFormElement).reset()
        // Close subchapter form if it was open
        if (parentId) {
          setShowAddSubchapter(null)
        }
      }
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
    const isShowingAddForm = showAddSubchapter === chapterId
    const isTopLevel = depth === 0

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
                value={chapter.title ?? ""}
                onChange={(e) =>
                  handleUpdate(sectionKey, chapterId, {
                    title: e.target.value,
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
                value={chapter.slug ?? ""}
                onChange={(e) =>
                  handleUpdate(sectionKey, chapterId, {
                    slug: e.target.value,
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
              {isTopLevel && (
                <button
                  type="button"
                  onClick={() => setShowAddSubchapter(chapterId)}
                  style={{
                    padding: "6px 12px",
                    fontSize: 12,
                    background: "#4a90e2",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                  title="Add subchapter"
                >
                  + Sub
                </button>
              )}
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
            {isShowingAddForm && (
              <form
                onSubmit={async (e) => {
                  await handleAddNewChapter(e, chapterId, sectionKey)
                  setShowAddSubchapter(null)
                }}
                style={{
                  marginTop: 12,
                  padding: 12,
                  background: "#f8f9fa",
                  borderRadius: 4,
                  border: "1px solid #e0e0e0",
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <input
                  type="text"
                  name="chapter title"
                  placeholder="Subchapter Title"
                  required
                  style={{
                    width: 180,
                    height: 32,
                    padding: "4px 8px",
                    border: "1px solid #ddd",
                    borderRadius: 4,
                    fontSize: 14,
                  }}
                />
                <input
                  type="text"
                  name="chapter slug"
                  placeholder="Subchapter Slug"
                  required
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
                  type="submit"
                  style={{
                    padding: "6px 16px",
                    fontSize: 14,
                    background: "#4a90e2",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddSubchapter(null)}
                  style={{
                    padding: "6px 16px",
                    fontSize: 14,
                    background: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </form>
            )}
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
                      maxHeight: sectionKey === "body" ? "60vh" : "auto",
                      overflowY: sectionKey === "body" ? "auto" : "visible",
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
