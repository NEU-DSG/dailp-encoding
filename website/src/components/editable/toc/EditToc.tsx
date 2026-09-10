import React, { useEffect, useState } from "react"
import { DragDropContext, Droppable } from "react-beautiful-dnd"
import ConfirmationPopup from "src/components/confirmation-popup"
import { EditTocProvider } from "src/components/editable/toc/edit-toc-context"
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
  const [draftTarget, setDraftTarget] = useState<DraftTarget | null>(null)
  const [draftTitle, setDraftTitle] = useState("")
  const [draftSlug, setDraftSlug] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  // Grabs all pending chapters to find which are available including from qeury
  const pendingChapterSlugs = new Set([
    ...utils.getPendingSlugs(chaptersBySection.intro),
    ...utils.getPendingSlugs(chaptersBySection.body),
    ...utils.getPendingSlugs(chaptersBySection.credit),
  ])

  const availableSlugs = (slugData?.allChapterSlugs ?? [])
    .map((s) => s.slug)
    .filter((slug) => !pendingChapterSlugs.has(slug))

  useEffect(() => {
    if (collection?.chapters)
      // Build chapters if collection changes
      setChaptersBySection(
        utils.buildChaptersBySection(collection.chapters as any)
      )
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
      ? utils.getChapterById(chaptersBySection[sectionKey], parentId)
      : null

    const sectionSize = parent
      ? parent.children.length
      : chaptersBySection[sectionKey].length

    const newChapter: ChapterNode = {
      clientId: utils.generateClientId(),
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
        [section]: utils.removeChapterFromSection(prev[section], id),
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
      [section]: utils.removeChapterFromSection(prev[section], id),
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
      // For each sesction, add pending chapters or throw on fail
      const introResult = await utils.addPendingChapters(
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

      const bodyResult = await utils.addPendingChapters(
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

      const creditResult = await utils.addPendingChapters(
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
            if (collection?.chapters)
              setChaptersBySection(
                utils.buildChaptersBySection(collection.chapters as any)
              )
            cancelDraft()
          }}
        />
      </form>
    </EditTocProvider>
  )
}
