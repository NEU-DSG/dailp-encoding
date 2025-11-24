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

// Group chapters by CollectionSection type
const groupBySection = (nodes: readonly any[] | undefined) => {
  if (!nodes) return { intro: [], body: [], credit: [] }

  const nodesWithIds = (nodes ?? []).map((n) => ({
    ...n,
    clientId: idOf(n) || generateId(),
  }))

  const grouped = {
    intro: nodesWithIds.filter((n) => n.section === CollectionSection.Intro),
    body: nodesWithIds.filter((n) => n.section === CollectionSection.Body),
    credit: nodesWithIds.filter((n) => n.section === CollectionSection.Credit),
  }

  return grouped
}

export const EditableToc = ({ collectionSlug }: { collectionSlug: string }) => {
  const [{ data, fetching }, refetch] = Dailp.useEditedCollectionQuery({
    variables: { slug: collectionSlug },
  })
  const collection = data?.editedCollection
  const [, updateOrder] = Dailp.useUpdateCollectionChapterOrderMutation()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [chaptersBySection, setChaptersBySection] = useState({
    intro: [] as any[],
    body: [] as any[],
    credit: [] as any[],
  })
  const [collectionTitle, setCollectionTitle] = useState(
    collection?.title ?? "no name"
  )
  const [collectionDescription, setCollectionDescription] = useState("")

  // Sync editable items when collection loads/changes
  useEffect(() => {
    if (collection?.chapters) {
      setChaptersBySection(groupBySection(collection.chapters as any))
    }
    setCollectionTitle(collection?.title ?? "no name")
  }, [collection])

  if (!collection) {
    return null
  }



  const handleDragEnd = (result: any) => {
    const { source, destination } = result
    if (!destination) return

    const sourceSection = source.droppableId as keyof typeof chaptersBySection
    const destSection =
      destination.droppableId as keyof typeof chaptersBySection

    setChaptersBySection((prev) => {
      const sourceList = [...prev[sourceSection]]
      const [removed] = sourceList.splice(source.index, 1)

      // If dropped in same section, just reorder
      if (sourceSection === destSection) {
        sourceList.splice(destination.index, 0, removed)
        return { ...prev, [sourceSection]: sourceList }
      }

      // If dropped in different section, move to that section and update the section field
      const destList = [...prev[destSection]]
      const updatedChapter = {
        ...removed,
        section:
          destSection === "intro"
            ? CollectionSection.Intro
            : destSection === "body"
            ? CollectionSection.Body
            : CollectionSection.Credit,
      }
      destList.splice(destination.index, 0, updatedChapter)
      return {
        ...prev,
        [sourceSection]: sourceList,
        [destSection]: destList,
      }
    })
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage(null)
    setIsSaving(true)

    try {
      // Collect all chapters from all sections with their new indices
      const chapters: Dailp.ChapterOrderInput[] = []

      // Process each section
      ;(["intro", "body", "credit"] as const).forEach((sectionKey) => {
        const sectionChapters = chaptersBySection[sectionKey]
        const section =
          sectionKey === "intro"
            ? CollectionSection.Intro
            : sectionKey === "body"
            ? CollectionSection.Body
            : CollectionSection.Credit

        sectionChapters.forEach((chapter, index) => {
          // Only include chapters that have been persisted (have an id)
          // New chapters without ids will need to be created separately
          if (chapter.id) {
            chapters.push({
              id: chapter.id,
              indexInParent: index + 1, // 1-indexed
              section: section,
            })
          }
        })
      })

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

  const handleAddNewChapter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const title = formData.get("chapter title") as string
    const slug = formData.get("chapter slug") as string
    const section = formData.get(
      "chapter section"
    ) as keyof typeof chaptersBySection

    setErrorMessage(null)
    // new chapter mutation
    const newChapter = {
      id: undefined,
      clientId: generateId(),
      title,
      slug,
      section:
        section === "intro"
          ? CollectionSection.Intro
          : section === "body"
          ? CollectionSection.Body
          : CollectionSection.Credit,
      path: [],
      indexInParent: 0,
    }

    setChaptersBySection((prev) => ({
      ...prev,
      [section]: [...prev[section], newChapter],
    }))
    ;(e.target as HTMLFormElement).reset()
  }

  const handleRemove = (
    section: keyof typeof chaptersBySection,
    id: string,
    title: string
  ) => {
    const ok = confirm(`Delete ${title}?`)
    if (!ok) return
    setChaptersBySection((prev) => ({
      ...prev,
      [section]: prev[section].filter((ch) => idOf(ch) !== id),
    }))
  }

  const handleUpdate = (
    section: keyof typeof chaptersBySection,
    id: string,
    update: Partial<any>
  ) => {
    setChaptersBySection((prev) => ({
      ...prev,
      [section]: prev[section].map((ch) =>
        idOf(ch) === id ? { ...ch, ...update } : ch
      ),
    }))
  }

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          name="collection title"
          placeholder="Collection Title"
          value={collectionTitle}
          onChange={(e) => setCollectionTitle(e.target.value)}
          style={{ width: "100%", marginBottom: 8, padding: 8 }}
        />
        <textarea
          name="collection description"
          placeholder="Description"
          value={collectionDescription}
          onChange={(e) => setCollectionDescription(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />
      </div>
      <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
        <h4 style={{ marginTop: 0, marginBottom: 16 }}>
          Table of Contents Editor
        </h4>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 16,
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
                <>
                  <h5 style={{ marginTop: 0, marginBottom: 8 }}>
                    {sectionName}
                  </h5>
                  <div
                    key={sectionKey}
                    style={{
                      border: "1px solid #ddd",
                      padding: 8,
                      borderRadius: 4,
                      ...(sectionKey === "body"
                        ? { height: "50vh", overflow: "scroll" }
                        : {}),
                    }}
                  >
                    <Droppable droppableId={sectionKey} direction="vertical">
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          style={{ minHeight: 40 }}
                        >
                          {chapters.map((chapter, index) => (
                            <Draggable
                              key={idOf(chapter)}
                              draggableId={idOf(chapter)}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  style={{
                                    ...provided.draggableProps.style,
                                    background: snapshot.isDragging
                                      ? "#fafafa"
                                      : "#f9f9f9",
                                    border: "1px solid #ddd",
                                    borderRadius: 4,
                                    padding: 8,
                                    marginBottom: 8,
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      gap: 6,
                                      alignItems: "center",
                                      flexWrap: "wrap",
                                    }}
                                  >
                                    <span
                                      {...provided.dragHandleProps}
                                      style={{ cursor: "grab", color: "#666" }}
                                    >
                                      <MdDragIndicator size={16} />
                                    </span>
                                    <input
                                      type="text"
                                      placeholder="Title"
                                      value={chapter.title ?? ""}
                                      onChange={(e) =>
                                        handleUpdate(
                                          sectionKey,
                                          idOf(chapter),
                                          {
                                            title: e.target.value,
                                          }
                                        )
                                      }
                                      style={{
                                        flex: 1,
                                        minWidth: 150,
                                        height: 28,
                                      }}
                                    />
                                    <input
                                      type="text"
                                      placeholder="Slug"
                                      value={chapter.slug ?? ""}
                                      onChange={(e) =>
                                        handleUpdate(
                                          sectionKey,
                                          idOf(chapter),
                                          {
                                            slug: e.target.value,
                                          }
                                        )
                                      }
                                      style={{
                                        flex: 1,
                                        minWidth: 100,
                                        height: 28,
                                      }}
                                    />
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleRemove(
                                          sectionKey,
                                          idOf(chapter),
                                          chapter.title
                                        )
                                      }
                                      style={{
                                        padding: "4px 8px",
                                        fontSize: 12,
                                      }}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </>
              )
            })}
          </div>
        </DragDropContext>
      </div>
      <form onSubmit={handleAddNewChapter} style={{ marginTop: 16 }}>
        {errorMessage && (
          <p style={{ color: "#b00020", margin: "0 0 8px" }}>{errorMessage}</p>
        )}
        <input type="text" name="chapter title" placeholder="Chapter Title" />
        <input type="text" name="chapter slug" placeholder="Chapter Slug" />
        <select name="chapter section">
          <option value="intro">Intro</option>
          <option value="body">Body</option>
          <option value="credit">Credit</option>
        </select>
        <button type="submit">Add Chapter</button>
      </form>
      <form onSubmit={handleSave}>
        <button type="submit" disabled={isSaving || fetching}>
          {isSaving ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={() =>
            collection?.chapters &&
            setChaptersBySection(groupBySection(collection.chapters as any))
          }
          disabled={isSaving || fetching}
        >
          Reset
        </button>
      </form>
    </>
  )
}
