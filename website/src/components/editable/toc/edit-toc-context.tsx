import { createContext, useContext } from "react"
import type { ChapterNode, DraftTarget, SectionKey } from "src/types/edit-toc"

// Decided to create a context for the rows due to massive props being unmanagable
export type EditTocContextValue = {
  draftTarget: DraftTarget | null // Null if no open draft or location if DraftTarget
  draftTitle: string
  draftSlug: string
  availableSlugs: string[] // Provided to ensure no repeat slugs
  onDraftTitleChange: (value: string) => void
  onDraftSlugChange: (value: string) => void
  onConfirmDraft: () => void // On "Add Chapter" click
  onCancelDraft: () => void // On "Cancel" click
  onOpenDraft: (sectionKey: SectionKey, parentId: string | null) => void // On "+" click
  onRemove: (
    section: SectionKey,
    id: string,
    title: string,
    isNew: boolean // Remove when true vs delete when false
  ) => void // On "Remove" or "Delete" click
}

const EditTocContext = createContext<EditTocContextValue | null>(null)

export const EditTocProvider = EditTocContext.Provider

export const useEditToc = (): EditTocContextValue => {
  const context = useContext(EditTocContext)
  if (!context)
    throw new Error("useEditToc must be used within a tocEditorProvider")
  return context
}
