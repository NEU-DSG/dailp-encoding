import { createContext, useContext } from "react"
import type { ChapterNode, DraftTarget, SectionKey } from "src/types/edit-toc"

// Value of the "+ Create Chapter" option in the draft row's slug dropdown.
// Can't collide with a real slug: slugs only contain [a-z0-9_].
export const CREATE_CHAPTER = "+create"

// Decided to create a context for the rows due to massive props being unmanagable
export type EditTocContextValue = {
  draftTarget: DraftTarget | null // Null if no open draft or location if DraftTarget
  draftTitle: string
  draftSlug: string
  availableSlugs: string[] // Provided to ensure no repeat slugs
  isCreating: boolean // True while a "+ Create Chapter" request is in flight
  onDraftTitleChange: (value: string) => void
  onDraftSlugChange: (value: string) => void
  onConfirmDraft: () => void // On "Add Chapter" click
  onCancelDraft: () => void // On "Cancel" click
  onOpenDraft: (sectionKey: SectionKey, parentId: string | null) => void // On "+" click
  onRemove: (
    section: SectionKey,
    id: string,
    title: string,
    isNew: boolean // Pending (unsaved) chapter vs saved chapter
  ) => void // On "Remove" or "Delete" click; saved chapters are unassigned on "Save Changes"
}

const EditTocContext = createContext<EditTocContextValue | null>(null)

export const EditTocProvider = EditTocContext.Provider

export const useEditToc = (): EditTocContextValue => {
  const context = useContext(EditTocContext)
  if (!context)
    throw new Error("useEditToc must be used within a tocEditorProvider")
  return context
}
