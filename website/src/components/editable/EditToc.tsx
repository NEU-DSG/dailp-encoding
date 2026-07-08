import React, { useEffect, useState } from "react"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import { MdDragIndicator } from "react-icons/md/index"
import * as Dailp from "src/graphql/dailp"
import { CollectionSection } from "src/graphql/dailp"
import ConfirmationPopup from "../confirmation-popup"
import Sidebar from "../sidebar"
import * as css from "./EditToc.css"
import PreviewToc from "./preview-toc-content"

// Stable identifiers for items: prefer backend id, then clientId
const idOf = (n: any): string => {
  if (!n) return ""
  const persistedId = n?.id != null ? String(n.id) : ""
  const clientId = n?.clientId != null ? String(n.clientId) : ""
  return persistedId || clientId
}

const generateId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2)}`

const sectionToKey = (
  section: CollectionSection
): "intro" | "body" | "credit" => {
  if (section === CollectionSection.Intro) return "intro"
  if (section === CollectionSection.Body) return "body"
  if (section === CollectionSection.Credit) return "credit"
  return "body"
}

type ChapterNode = {
  id?: string
  clientId?: string
  title: string
  slug: string
  section: CollectionSection
  indexInParent: number
  path: string[]
  children: ChapterNode[]
  isNew?: boolean
}

type SectionKey = "intro" | "body" | "credit"

type DraftTarget = {
  sectionKey: SectionKey
  parentId: string | null
}

const buildNestedStructure = (
  nodes: readonly any[] | undefined
): {
  intro: ChapterNode[]
  body: ChapterNode[]
  credit: ChapterNode[]
} => {
  if (!nodes) return { intro: [], body: [], credit: [] }

  const nodesWithIds = (nodes ?? [])
    .filter((n) => n.indexInParent !== -1)
    .map((n) => ({
      ...n,
      clientId: idOf(n) || generateId(),
    }))

  const sorted = [...nodesWithIds].sort((a, b) => {
    const depthDiff = (a?.path?.length ?? 0) - (b?.path?.length ?? 0)
    if (depthDiff !== 0) return depthDiff
    return (a?.indexInParent ?? 0) - (b?.indexInParent ?? 0)
  })

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

    const parentSlug =
      node.path && node.path.length > 1
        ? node.path[node.path.length - 2]
        : undefined

    if (parentSlug) {
      const parent = slugToNode.get(parentSlug)
      if (parent) {
        parent.children.push(chapter)
      } else {
        const sectionKey = sectionToKey(node.section)
        topLevel[sectionKey].push(chapter)
      }
    } else {
      const sectionKey = sectionToKey(node.section)
      topLevel[sectionKey].push(chapter)
    }
  }

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

type DraftRowProps = {
  draftTitle: string
  draftSlug: string
  onTitleChange: (value: string) => void
  onSlugChange: (value: string) => void
  onConfirm: () => void
  onCancel: () => void
  availableSlugs: string[] | undefined
}

const DraftRow = ({
  draftTitle,
  draftSlug,
  onTitleChange,
  onSlugChange,
  onConfirm,
  onCancel,
  availableSlugs,
}: DraftRowProps) => (
  <li className={css.chapterRow.draft}>
    <div className={css.chapterRowContent}>
      <div className={css.leftGroup}>
        <input
          type="text"
          placeholder="Title"
          value={draftTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          className={css.titleInput}
        />
        <select
          value={draftSlug}
          onChange={(e) => onSlugChange(e.target.value)}
          className={css.slugInput}
        >
          <option value="">Select a slug...</option>
          {availableSlugs?.map((s) => (
            <option value={s} key={s}>
              {s.replace(/_/g, "-")}
            </option>
          ))}
        </select>
      </div>
      <div className={css.rightGroup}>
        <button
          type="button"
          onClick={onConfirm}
          className={css.tocButton.primary}
        >
          Add Chapter
        </button>
        <button
          type="button"
          onClick={onCancel}
          className={css.tocButton.neutral}
        >
          Cancel
        </button>
      </div>
    </div>
  </li>
)

type ChapterItemProps = {
  chapter: ChapterNode
  index: number
  sectionKey: SectionKey
  depth: number
  draftTarget: DraftTarget | null
  draftTitle: string
  draftSlug: string
  availableSlugs: string[] | undefined
  onDraftTitleChange: (value: string) => void
  onDraftSlugChange: (value: string) => void
  onConfirmDraft: () => void
  onCancelDraft: () => void
  onOpenDraft: (sectionKey: SectionKey, parentId: string | null) => void
  onUpdate: (
    section: SectionKey,
    id: string,
    update: Partial<ChapterNode>
  ) => void
  onRemove: (
    section: SectionKey,
    id: string,
    title: string,
    isNew: boolean
  ) => void
}

const ChapterItem = ({
  chapter,
  index,
  sectionKey,
  depth,
  draftTarget,
  draftTitle,
  draftSlug,
  availableSlugs,
  onDraftTitleChange,
  onDraftSlugChange,
  onConfirmDraft,
  onCancelDraft,
  onOpenDraft,
  onUpdate,
  onRemove,
}: ChapterItemProps) => {
  const chapterId = idOf(chapter)
  const isTopLevel = depth === 0
  const [localTitle, setLocalTitle] = useState(chapter.title ?? "")
  const [localSlug, setLocalSlug] = useState(chapter.slug ?? "")

  useEffect(() => {
    setLocalTitle(chapter.title ?? "")
    setLocalSlug(chapter.slug ?? "")
  }, [chapter.id, chapter.clientId])

  const hasDraftHere =
    draftTarget?.sectionKey === sectionKey && draftTarget.parentId === chapterId

  return (
    <Draggable key={chapterId} draggableId={chapterId} index={index}>
      {(provided, snapshot) => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={
            chapter.isNew
              ? css.chapterRow.draft
              : snapshot.isDragging
              ? css.chapterRow.dragging
              : css.chapterRow.default
          }
        >
          <div className={css.chapterRowContent} {...provided.dragHandleProps}>
            <div className={css.leftGroup}>
              <span className={css.dragHandle}>
                <MdDragIndicator size={16} />
              </span>
              {!isTopLevel && <span className={css.nestedArrow}>↳</span>}
              {chapter.isNew && <span className={css.newBadge}>NEW</span>}
              <input
                type="text"
                placeholder="Title"
                value={localTitle}
                onChange={(e) => setLocalTitle(e.target.value)}
                onBlur={() =>
                  onUpdate(sectionKey, chapterId, { title: localTitle })
                }
                className={css.titleInput}
              />
              <input
                type="text"
                placeholder="Slug"
                value={(localSlug ?? "").replace(/_/g, "-")}
                onChange={(e) =>
                  setLocalSlug(e.target.value.replace(/-/g, "_"))
                }
                onBlur={() =>
                  localSlug &&
                  onUpdate(sectionKey, chapterId, { slug: localSlug })
                }
                className={css.slugInput}
                disabled
              />
            </div>
            <div className={css.rightGroup}>
              {isTopLevel && (
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
                  onRemove(
                    sectionKey,
                    chapterId,
                    chapter.title,
                    !!chapter.isNew
                  )
                }
                className={
                  chapter.isNew ? css.tocButton.neutral : css.tocButton.danger
                }
              >
                {chapter.isNew ? "Remove" : "Delete"}
              </button>
            </div>
          </div>
          {(chapter.children.length > 0 || hasDraftHere) && (
            <Droppable
              droppableId={`${sectionKey}:${chapterId}`}
              type={`${chapterId}`}
              direction="vertical"
            >
              {(dropProvided) => (
                <ul
                  ref={dropProvided.innerRef}
                  {...dropProvided.droppableProps}
                  className={css.nestedList}
                >
                  {chapter.children.map((child, childIndex) => (
                    <ChapterItem
                      key={idOf(child)}
                      chapter={child}
                      index={childIndex}
                      sectionKey={sectionKey}
                      depth={depth + 1}
                      draftTarget={draftTarget}
                      draftTitle={draftTitle}
                      draftSlug={draftSlug}
                      availableSlugs={availableSlugs}
                      onDraftTitleChange={onDraftTitleChange}
                      onDraftSlugChange={onDraftSlugChange}
                      onConfirmDraft={onConfirmDraft}
                      onCancelDraft={onCancelDraft}
                      onOpenDraft={onOpenDraft}
                      onUpdate={onUpdate}
                      onRemove={onRemove}
                    />
                  ))}
                  {dropProvided.placeholder}
                  {hasDraftHere && (
                    <DraftRow
                      draftTitle={draftTitle}
                      draftSlug={draftSlug}
                      availableSlugs={availableSlugs}
                      onTitleChange={onDraftTitleChange}
                      onSlugChange={onDraftSlugChange}
                      onConfirm={onConfirmDraft}
                      onCancel={onCancelDraft}
                    />
                  )}
                </ul>
              )}
            </Droppable>
          )}
        </li>
      )}
    </Draggable>
  )
}

export const EditableToc = ({ collectionSlug }: { collectionSlug: string }) => {
  const [{ data, fetching }, refetch] = Dailp.useEditedCollectionQuery({
    variables: { slug: collectionSlug },
  })
  const collection = data?.editedCollection
  const [, updateOrder] = Dailp.useUpdateCollectionChapterOrderMutation()
  const [, removeChapter] = Dailp.useRemoveCollectionChapterMutation()
  const [, addChapter] = Dailp.useAddCollectionChapterMutation()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  const [{ data: slugData }, refetchSlugs] = Dailp.useAllChapterSlugsQuery({
    variables: { collectionSlug: collectionSlug.replace(/-/g, "_") },
  })

  const [chaptersBySection, setChaptersBySection] = useState<{
    intro: ChapterNode[]
    body: ChapterNode[]
    credit: ChapterNode[]
  }>({
    intro: [],
    body: [],
    credit: [],
  })

  const [draftTarget, setDraftTarget] = useState<DraftTarget | null>(null)
  const [draftTitle, setDraftTitle] = useState("")
  const [draftSlug, setDraftSlug] = useState("")

  const toggleResetting = () => setIsResetting((prev) => !prev)

  useEffect(() => {
    if (collection?.chapters) {
      setChaptersBySection(buildNestedStructure(collection.chapters as any))
    }
  }, [collection, data])

  if (!collection) {
    return null
  }

  const updateIndices = (chapters: ChapterNode[]): void => {
    chapters.forEach((ch, idx) => {
      ch.indexInParent = idx + 1
      updateIndices(ch.children)
    })
  }

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
    if (source.droppableId !== destination.droppableId) return

    if (type === "SECTION_CHAPTERS") {
      const sectionKey = source.droppableId as SectionKey
      setChaptersBySection((prev) => {
        const reordered = reorder(
          prev[sectionKey],
          source.index,
          destination.index
        )
        const newState = { ...prev, [sectionKey]: reordered }
        updateIndices(newState.intro)
        updateIndices(newState.body)
        updateIndices(newState.credit)
        return newState
      })
      return
    }

    const parentId = type
    const sectionKey = source.droppableId.split(":")[0] as SectionKey

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

      const newState = { ...prev, [sectionKey]: updatedSection }
      updateIndices(newState.intro)
      updateIndices(newState.body)
      updateIndices(newState.credit)
      return newState
    })
  }

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
      result.push(...flattenChapters(chapter.children, section))
    }
    return result
  }

  const createPendingChapters = async (
    chapters: ChapterNode[],
    section: CollectionSection,
    parentChapterId?: string
  ): Promise<{ updated: ChapterNode[]; error?: string }> => {
    const updated: ChapterNode[] = []
    for (const chapter of chapters) {
      let current = chapter
      if (chapter.isNew && !chapter.id) {
        // find the unassigned chapter row by slug
        const existingChapter = slugData?.allChapterSlugs.find(
          (s) => s.slug === chapter.slug
        )
        if (!existingChapter) {
          return {
            updated,
            error: `No unassigned chapter found with slug "${chapter.slug}"`,
          }
        }

        const result = await addChapter({
          input: {
            id: existingChapter.id,
            collectionSlug: collectionSlug.replace(/-/g, "_"),
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
        const newId = (result.data as any)?.addCollectionChapter
        current = { ...chapter, id: newId, isNew: false }
      }
      const childResult = await createPendingChapters(
        current.children,
        section,
        current.id
      )
      if (childResult.error) {
        return {
          updated: [...updated, { ...current, children: childResult.updated }],
          error: childResult.error,
        }
      }
      updated.push({ ...current, children: childResult.updated })
    }
    return { updated }
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage(null)

    if (draftTarget) {
      setErrorMessage(
        "You have an unsaved chapter draft. Finish adding it or cancel before saving."
      )
      return
    }

    setIsSaving(true)
    try {
      const introResult = await createPendingChapters(
        chaptersBySection.intro,
        CollectionSection.Intro
      )
      if (introResult.error) {
        setErrorMessage(introResult.error)
        return
      }
      const bodyResult = await createPendingChapters(
        chaptersBySection.body,
        CollectionSection.Body
      )
      if (bodyResult.error) {
        setErrorMessage(bodyResult.error)
        return
      }
      const creditResult = await createPendingChapters(
        chaptersBySection.credit,
        CollectionSection.Credit
      )
      if (creditResult.error) {
        setErrorMessage(creditResult.error)
        return
      }

      const updatedSections = {
        intro: introResult.updated,
        body: bodyResult.updated,
        credit: creditResult.updated,
      }
      updateIndices(updatedSections.intro)
      updateIndices(updatedSections.body)
      updateIndices(updatedSections.credit)
      setChaptersBySection(updatedSections)

      const chapters: Dailp.ChapterOrderInput[] = [
        ...flattenChapters(updatedSections.intro, CollectionSection.Intro),
        ...flattenChapters(updatedSections.body, CollectionSection.Body),
        ...flattenChapters(updatedSections.credit, CollectionSection.Credit),
      ]

      if (chapters.length === 0) {
        setErrorMessage("No chapters to save.")
        return
      }

      const result = await updateOrder({ input: { collectionSlug, chapters } })
      if (result.error) {
        setErrorMessage(result.error.message || "Failed to save order")
        return
      }

      await refetch()
      await refetchSlugs()
      setErrorMessage(null)
    } catch (error: any) {
      setErrorMessage(error.message || "An unexpected error occurred")
    } finally {
      setIsSaving(false)
    }
  }

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

  const addChapterToNested = (
    chapters: ChapterNode[],
    newChapter: ChapterNode,
    parentId: string | null
  ): ChapterNode[] => {
    if (!parentId) {
      return [...chapters, newChapter]
    }
    return chapters.map((ch) => {
      if (idOf(ch) === parentId) {
        return { ...ch, children: [...ch.children, newChapter] }
      }
      return {
        ...ch,
        children: addChapterToNested(ch.children, newChapter, parentId),
      }
    })
  }

  const handleRemove = async (
    section: SectionKey,
    id: string,
    title: string,
    isNew: boolean
  ) => {
    if (isNew) {
      setChaptersBySection((prev) => ({
        ...prev,
        [section]: removeChapterFromNested(prev[section], id),
      }))
      return
    }

    const ok = confirm(
      `Remove ${title} from this collection? (The chapter and document will not be deleted)`
    )
    if (!ok) return

    setErrorMessage(null)
    setIsSaving(true)

    const previousState = chaptersBySection
    setChaptersBySection((prev) => ({
      ...prev,
      [section]: removeChapterFromNested(prev[section], id),
    }))

    try {
      const result = await removeChapter({ chapterId: id })

      if (result.error) {
        setChaptersBySection(previousState)
        setErrorMessage(result.error.message || "Failed to remove chapter")
      } else {
        await refetch()
        await refetchSlugs()
        setErrorMessage(null)
      }
    } catch (error: any) {
      setChaptersBySection(previousState)
      setErrorMessage(error.message || "An unexpected error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdate = (
    section: SectionKey,
    id: string,
    update: Partial<ChapterNode>
  ) => {
    setChaptersBySection((prev) => ({
      ...prev,
      [section]: updateChapterInNested(prev[section], id, update),
    }))
  }

  const openDraft = (sectionKey: SectionKey, parentId: string | null) => {
    setDraftTarget({ sectionKey, parentId })
    setDraftTitle("")
    setDraftSlug("")
  }

  const cancelDraft = () => {
    setDraftTarget(null)
    setDraftTitle("")
    setDraftSlug("")
  }

  const confirmDraft = () => {
    if (!draftTarget) return
    if (!draftTitle || !draftSlug) {
      setErrorMessage("Title and slug are required")
      return
    }

    if (!slugData?.allChapterSlugs.some((s) => s.slug === draftSlug)) {
      setErrorMessage("Slug must exist with an already existing document")
      return
    }

    const { sectionKey, parentId } = draftTarget
    const sectionEnum =
      sectionKey === "intro"
        ? CollectionSection.Intro
        : sectionKey === "body"
        ? CollectionSection.Body
        : CollectionSection.Credit

    let sectionSize = 0
    if (!parentId) {
      sectionSize = chaptersBySection[sectionKey].length
    } else {
      const parent = findChapterInNested(
        chaptersBySection[sectionKey],
        parentId
      )
      sectionSize = parent ? parent.children.length : 0
    }

    const newChapter: ChapterNode = {
      clientId: generateId(),
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
      [sectionKey]: addChapterToNested(prev[sectionKey], newChapter, parentId),
    }))

    setErrorMessage(null)
    cancelDraft()
  }

  const pendingChapterSlugs = new Set(
    [
      ...chaptersBySection.intro,
      ...chaptersBySection.body,
      ...chaptersBySection.credit,
    ]
      .filter((ch) => ch.isNew)
      .map((ch) => ch.slug)
  )

  const availableSlugs = (slugData?.allChapterSlugs ?? [])
    .map((s) => s.slug)
    .filter((slug) => !pendingChapterSlugs.has(slug))

  return (
    <>
      <Sidebar
        isPreview={true}
        alternateContent={<PreviewToc chaptersBySection={chaptersBySection} />}
      />
      <div className={css.container}>
        <h2 className={css.collectionTitle}>{collection.title}</h2>
        {errorMessage && <div className={css.errorBanner}>{errorMessage}</div>}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className={css.sectionsGrid}>
            {(["intro", "body", "credit"] as const).map((sectionKey) => {
              const sectionName =
                sectionKey === "intro"
                  ? "Intro"
                  : sectionKey === "body"
                  ? "Body"
                  : "Credit"
              const chapters = chaptersBySection[sectionKey]
              const hasTopLevelDraftHere =
                draftTarget?.sectionKey === sectionKey &&
                draftTarget.parentId === null

              return (
                <div key={sectionKey}>
                  <h3 className={css.sectionHeading}>{sectionName}</h3>
                  <div className={css.sectionPanel}>
                    <Droppable
                      droppableId={sectionKey}
                      type="SECTION_CHAPTERS"
                      direction="vertical"
                    >
                      {(provided) => (
                        <ul
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={css.chapterList}
                        >
                          {chapters.map((chapter, index) => (
                            <ChapterItem
                              key={idOf(chapter)}
                              chapter={chapter}
                              index={index}
                              sectionKey={sectionKey}
                              depth={0}
                              draftTarget={draftTarget}
                              draftTitle={draftTitle}
                              draftSlug={draftSlug}
                              availableSlugs={availableSlugs}
                              onDraftTitleChange={setDraftTitle}
                              onDraftSlugChange={setDraftSlug}
                              onConfirmDraft={confirmDraft}
                              onCancelDraft={cancelDraft}
                              onOpenDraft={openDraft}
                              onUpdate={handleUpdate}
                              onRemove={handleRemove}
                            />
                          ))}
                          {provided.placeholder}
                          {hasTopLevelDraftHere && (
                            <DraftRow
                              draftTitle={draftTitle}
                              draftSlug={draftSlug}
                              availableSlugs={availableSlugs}
                              onTitleChange={setDraftTitle}
                              onSlugChange={setDraftSlug}
                              onConfirm={confirmDraft}
                              onCancel={cancelDraft}
                            />
                          )}
                        </ul>
                      )}
                    </Droppable>
                  </div>
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
        </DragDropContext>
      </div>
      <form onSubmit={handleSave} className={css.saveRow}>
        <button
          type="submit"
          disabled={isSaving || fetching}
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
          onClick={toggleResetting}
          disabled={isSaving || fetching}
          className={css.tocButton.neutral}
        >
          Reset
        </button>
        <ConfirmationPopup
          PopupText="Are you sure you want to reset your changes?"
          actionName="Confirm"
          isPopupShowing={isResetting}
          toggleVisibility={toggleResetting}
          action={() => {
            collection?.chapters &&
              setChaptersBySection(
                buildNestedStructure(collection.chapters as any)
              )
            cancelDraft()
          }}
        />
      </form>
    </>
  )
}
