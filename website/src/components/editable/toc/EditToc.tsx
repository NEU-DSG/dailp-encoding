import React, { useEffect, useState } from "react"
import { DragDropContext, Droppable } from "react-beautiful-dnd"
import { Alert } from "src/components/alert"
import ConfirmationPopup from "src/components/confirmation-popup"
import {
  CREATE_CHAPTER,
  EditTocProvider,
} from "src/components/editable/toc/edit-toc-context"
import Sidebar from "src/components/sidebar"
import * as Dailp from "src/graphql/dailp"
import { CollectionSection } from "src/graphql/dailp"
import type {
  ChapterNode,
  ChaptersBySection,
  DraftTarget,
  SectionKey,
} from "src/types/edit-toc"
import * as utils from "src/utils/edit-toc"
import * as css from "./EditToc.css"
import PreviewToc from "./preview-toc-content"
import { ChapterRow, DraftRow } from "./toc-rows"

export const EditableToc = ({ collectionSlug }: { collectionSlug: string }) => {
  const normalizedSlug = collectionSlug.replace(/-/g, "_") // replaces _ with -

  const [{ data, fetching }, refetch] = Dailp.useEditedCollectionQuery({
    variables: { slug: collectionSlug },
  })
  const collection = data?.editedCollection
  const [, updateOrder] = Dailp.useUpdateCollectionChapterOrderMutation()
  const [, removeChapter] = Dailp.useRemoveCollectionChapterMutation()
  const [, addChapter] = Dailp.useAddCollectionChapterMutation()
  const [, createChapter] = Dailp.useCreateCollectionChapterMutation()

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
  // The TOC as last saved, to tell whether there are unsaved changes
  const [savedSections, setSavedSections] = useState<ChaptersBySection | null>(
    null
  )
  const [draftTarget, setDraftTarget] = useState<DraftTarget | null>(null)
  const [draftTitle, setDraftTitle] = useState("")
  const [draftSlug, setDraftSlug] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  // Every chapter currently in the TOC on screen, saved or pending
  const onScreenChapters = [
    ...utils.flattenChapters(chaptersBySection.intro),
    ...utils.flattenChapters(chaptersBySection.body),
    ...utils.flattenChapters(chaptersBySection.credit),
  ]
  // Slug keys (see utils.slugKey), since slugs come dashed or underscored
  const onScreenSlugs = new Set(
    onScreenChapters.map((ch) => utils.slugKey(ch.slug))
  )
  const onScreenIds = new Set(
    onScreenChapters.flatMap((ch) => (ch.id ? [String(ch.id)] : []))
  )

  // Saved chapters removed on screen but not yet saved, so they can be re-added
  const removedChapters = savedSections
    ? [
        ...utils.flattenChapters(savedSections.intro),
        ...utils.flattenChapters(savedSections.body),
        ...utils.flattenChapters(savedSections.credit),
      ].filter((ch) => ch.id && !onScreenIds.has(String(ch.id)))
    : []

  // Unassigned chapters in the backend plus ones removed before saving, one
  // entry per chapter whichever form its slug came in
  const availableByKey = new Map<string, string>()
  for (const slug of [
    ...(slugData?.allChapterSlugs ?? []).map((s) => s.slug),
    ...removedChapters.map((ch) => ch.slug),
  ]) {
    const key = utils.slugKey(slug)
    if (!onScreenSlugs.has(key) && !availableByKey.has(key))
      availableByKey.set(key, slug)
  }
  const availableSlugs = [...availableByKey.values()]

  // Backend ids for every chapter that can be (re-)added on save, from both
  // lists: unassigned chapters (slugData, refetched after "+ Create Chapter",
  // so it includes newly created ones) and the collection loaded with the page
  // (which has chapters removed on screen but not yet unassigned). documentId
  // is only known for unassigned ones; the backend keeps it otherwise.
  const unassignedChapters = slugData?.allChapterSlugs ?? []
  const unassignedIds = new Set(unassignedChapters.map((s) => s.id))
  const addableChapters = {
    allChapterSlugs: [
      ...unassignedChapters,
      ...(collection?.chapters ?? [])
        .filter((ch) => !unassignedIds.has(ch.id))
        .map((ch) => ({ id: ch.id, slug: ch.slug, documentId: null })),
    ],
  }

  useEffect(() => {
    if (collection?.chapters) {
      // Build chapters if collection changes
      const built = utils.buildChaptersBySection(collection.chapters as any)
      setChaptersBySection(built)
      setSavedSections(built)
    }
  }, [collection])

  const hasUnsavedChanges =
    savedSections !== null &&
    utils.tocSignature(chaptersBySection) !== utils.tocSignature(savedSections)

  // Ask the browser to confirm before closing, reloading, or leaving the page
  // while there are unsaved changes
  useEffect(() => {
    if (!hasUnsavedChanges) return
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = "" // Required by some browsers to show the prompt
    }
    // In-site links use client-side routing, which skips beforeunload, so
    // confirm those clicks ourselves (capture phase, before the router acts)
    const confirmLinkClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a[href]")
      if (
        !(link instanceof HTMLAnchorElement) ||
        link.target === "_blank" ||
        link.origin !== window.location.origin ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey
      )
        return
      if (!window.confirm("You have unsaved changes. Leave without saving?")) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
    window.addEventListener("beforeunload", warn)
    document.addEventListener("click", confirmLinkClick, true)
    return () => {
      window.removeEventListener("beforeunload", warn)
      document.removeEventListener("click", confirmLinkClick, true)
    }
  }, [hasUnsavedChanges])

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

  // Creates a new, unassigned (index -1) page chapter and opens its empty page
  // in the editor. The draft row then preselects it, so clicking "Add Chapter"
  // places it in the TOC.
  const createDraftChapter = async () => {
    const title = draftTitle.trim()
    if (!title) {
      setErrorMessage("A title is required to create a chapter.")
      return
    }

    // Open the tab now, while still inside the click: browsers block
    // window.open once we've awaited the request.
    const editorTab = window.open("", "_blank")
    setIsCreating(true)
    setErrorMessage(null)
    try {
      const result = await createChapter({
        input: { collectionSlug, title },
      })
      const created = result.data?.createCollectionChapter
      if (result.error || !created) {
        editorTab?.close()
        setErrorMessage(
          result.error?.graphQLErrors[0]?.message ??
            "Failed to create the chapter."
        )
        return
      }

      refetchSlugs({ requestPolicy: "network-only" })
      setDraftSlug(created.slug)

      // Same path the chapter view reads the page from (chapter.page.tsx)
      const pagePath = `/${collectionSlug}/${created.slug.replace(/_/g, "-")}`
      const editorUrl = `/edit?path=${encodeURIComponent(
        pagePath
      )}&title=${encodeURIComponent(created.title)}`
      if (editorTab) editorTab.location.href = editorUrl
      else window.location.href = editorUrl
    } catch (error: any) {
      editorTab?.close()
      setErrorMessage("Failed to create the chapter.")
    } finally {
      setIsCreating(false)
    }
  }

  // Add draft as pending
  const confirmDraft = () => {
    if (!draftTarget) return

    if (draftSlug === CREATE_CHAPTER) {
      createDraftChapter()
      return
    }

    if (!draftTitle || !draftSlug) {
      setErrorMessage("Title and slug are required fields.")
      return
    }

    if (!availableSlugs.includes(draftSlug)) {
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
      ? utils.getChapterById(chaptersBySection[sectionKey], parentId)
      : null

    const sectionSize = parent
      ? parent.children.length
      : chaptersBySection[sectionKey].length

    // Bring back the chapter's subchapters too, except any already in the TOC
    const existing = collection.chapters?.find(
      (ch) => utils.slugKey(ch.slug) === utils.slugKey(draftSlug)
    )
    const children = existing
      ? utils.buildPendingSubtree(
          existing.path,
          collection.chapters ?? [],
          new Set([...onScreenSlugs, utils.slugKey(draftSlug)]),
          sectionEnum
        )
      : []

    const newChapter: ChapterNode = {
      clientId: utils.generateClientId(),
      title: draftTitle,
      slug: draftSlug,
      section: sectionEnum,
      indexInParent: sectionSize + 1,
      path: [],
      children,
      isNew: true,
    }

    setChaptersBySection((prev) => ({
      ...prev,
      [sectionKey]: utils.addChapterToSection(
        prev[sectionKey],
        newChapter,
        parentId
      ),
    }))

    setErrorMessage(null)
    cancelDraft()
  }

  // Upon drag and placed, update all indices after moving chapter
  const handleDragEnd = (result: any) => {
    const { source, destination, type } = result
    if (!destination || source.droppableId !== destination.droppableId) return

    if (type === "SECTION_CHAPTERS") {
      const sectionKey = source.droppableId as SectionKey
      setChaptersBySection((prev) => {
        const newState = {
          ...prev,
          [sectionKey]: utils.moveOneChapter(
            prev[sectionKey],
            source.index,
            destination.index
          ),
        }
        utils.updateSectionIndices(newState.intro)
        utils.updateSectionIndices(newState.body)
        utils.updateSectionIndices(newState.credit)
        return newState
      })
      return
    }

    const parentId = type
    const sectionKey = source.droppableId.split(":")[0] as SectionKey

    setChaptersBySection((prev) => {
      const parent = utils.getChapterById(prev[sectionKey], parentId)

      if (!parent) return prev

      const reordered = utils.moveOneChapter(
        parent.children,
        source.index,
        destination.index
      )

      const updatedSection = utils.updateChildren(
        prev[sectionKey],
        parentId,
        reordered
      )

      const newState = { ...prev, [sectionKey]: updatedSection }
      utils.updateSectionIndices(newState.intro)
      utils.updateSectionIndices(newState.body)
      utils.updateSectionIndices(newState.credit)
      return newState
    })
  }

  // Removes a chapter row from the TOC on screen. Saved chapters are only
  // unassigned in the backend when "Save Changes" is clicked (see handleSave),
  // so "Reset" can bring them back.
  const handleRemove = (
    section: SectionKey,
    id: string,
    _title: string,
    _isNew: boolean
  ) => {
    setChaptersBySection((prev) => ({
      ...prev,
      [section]: utils.removeChapterFromSection(prev[section], id),
    }))
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
      // First unassign (index -1) every saved chapter that was removed on
      // screen, including subchapters of a removed chapter. Re-added ones are
      // put back in place by addPendingChapters below.
      const removedIds = removedChapters.map((ch) => String(ch.id))
      for (const id of removedIds) {
        const removed = await removeChapter({ chapterId: id })
        if (removed.error) {
          setErrorMessage("Failed to remove a chapter. Please try again.")
          return
        }
        // Keep the saved copy accurate even if a later step fails
        setSavedSections((prev) =>
          prev
            ? {
                intro: utils.removeChapterFromSection(prev.intro, id),
                body: utils.removeChapterFromSection(prev.body, id),
                credit: utils.removeChapterFromSection(prev.credit, id),
              }
            : prev
        )
      }

      // For each sesction, add pending chapters or throw on fail
      const introResult = await utils.addPendingChapters(
        chaptersBySection.intro,
        CollectionSection.Intro,
        addChapter,
        addableChapters,
        normalizedSlug
      )
      if (introResult.error) {
        setErrorMessage("Failed to save the Intro section.")
        return
      }

      const bodyResult = await utils.addPendingChapters(
        chaptersBySection.body,
        CollectionSection.Body,
        addChapter,
        addableChapters,
        normalizedSlug
      )
      if (bodyResult.error) {
        setErrorMessage("Failed to save the Body section.")
        return
      }

      const creditResult = await utils.addPendingChapters(
        chaptersBySection.credit,
        CollectionSection.Credit,
        addChapter,
        addableChapters,
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
      utils.updateSectionIndices(updatedSections.intro)
      utils.updateSectionIndices(updatedSections.body)
      utils.updateSectionIndices(updatedSections.credit)
      setChaptersBySection(updatedSections)

      const chapters: Dailp.ChapterOrderInput[] = [
        ...utils.ChaptersToOrderInput(
          updatedSections.intro,
          CollectionSection.Intro
        ),
        ...utils.ChaptersToOrderInput(
          updatedSections.body,
          CollectionSection.Body
        ),
        ...utils.ChaptersToOrderInput(
          updatedSections.credit,
          CollectionSection.Credit
        ),
      ]

      if (chapters.length === 0 && removedIds.length === 0) {
        setErrorMessage("No chapters to save.")
        return
      }

      // Nothing left to order if every chapter was removed
      if (chapters.length > 0) {
        const result = await updateOrder({
          input: { collectionSlug, chapters },
        })
        if (result.error) {
          setErrorMessage("Save failed due to an unexpected error.")
          return
        }
      }

      setSavedSections(updatedSections)
      await refetch()
      await refetchSlugs()
      setErrorMessage(null)
    } catch (error: any) {
      setErrorMessage("Save failed due to an unexpected error.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <EditTocProvider
      value={{
        draftTarget,
        draftTitle,
        draftSlug,
        availableSlugs,
        isCreating,
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
        {hasUnsavedChanges && (
          <Alert>
            You have unsaved changes. Click "Save Changes" to keep them.
          </Alert>
        )}
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

              const hasChapterDraftHere =
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
                            <ChapterRow
                              key={utils.idOf(chapter)}
                              chapter={chapter}
                              index={index}
                              sectionKey={sectionKey}
                              depth={0}
                            />
                          ))}
                          {provided.placeholder}
                          {hasChapterDraftHere && <DraftRow />}
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
            // Back to the last saved TOC (which reflects immediate removals)
            if (savedSections) setChaptersBySection(savedSections)
            cancelDraft()
          }}
        />
      </form>
    </EditTocProvider>
  )
}
