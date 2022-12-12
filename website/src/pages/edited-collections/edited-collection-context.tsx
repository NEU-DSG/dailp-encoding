import { createContext, useContext, useState } from "react"
import { DialogStateReturn, useDialogState } from "reakit/Dialog"
import * as Dailp from "src/graphql/dailp"
import { useRouteParams } from "src/renderer/PageShell"

export type Chapter = {
  title: string
  leaf: string
  indexInParent: number
  section: Dailp.CollectionSection
  children?: Chapter[]
}

type CollectionContext = {
  chapters: Chapter[] | undefined
  dialog: DialogStateReturn
  selected: Chapter[]
  setSelected: (chapters: Chapter[]) => void
}

const CollectionContext = createContext<CollectionContext>(
  {} as CollectionContext
)

export const CollectionProvider = (props: { children: any }) => {
  const { collectionSlug } = useRouteParams()

  // Queries for chapters of a collection.
  const [{ data }] = Dailp.useEditedCollectionQuery({
    variables: { slug: collectionSlug! },
  })

  // Gets the converted nested chapters using the backend query.
  const chapters = flatToNested(data?.editedCollection?.chapters)
  // Keeps track of the chapters selected SO FAR that have the same TOP parent (index of 1).
  const [selected, setSelected] = useState<Chapter[]>([])

  // Gets the dialog state for the TOC
  const dialog = useDialogState({
    animated: true,
  })

  return (
    <CollectionContext.Provider
      value={{ chapters, dialog, selected, setSelected }}
    >
      {props.children}
    </CollectionContext.Provider>
  )
}

export const useFunctions = () => {
  const { selected, setSelected } = useContext(CollectionContext)

  function onSelect(chapter: Chapter) {
    // The last chapter selected is the currentmost selected chapter.
    let lastChapter = selected[selected.length - 1]

    if (!lastChapter || chapter.indexInParent === 1) {
      // If no chapter was last selected, then start a new list of selected chapters.
      setSelected([chapter])
    } else if (lastChapter) {
      const idx = selected.findIndex(
        (c) => c.indexInParent === chapter.indexInParent
      )

      if (idx > 0) {
        selected.splice(idx, selected.length - idx)
      }

      selected.push(chapter)
      setSelected(selected)
    }
  }

  // Returns whether a chapter has been selected or not.
  function isSelected(item: Chapter) {
    return selected.map((chapter) => chapter.leaf).includes(item.leaf)
  }

  function lastSelected(item: Chapter) {
    if (selected[selected.length - 1]?.leaf === item.leaf) {
      return true
    }
    return false
  }

  return { onSelect, isSelected, lastSelected }
}

export const useChapters = () => {
  const context = useContext(CollectionContext)

  return context.chapters
}

export const useDialog = () => {
  const context = useContext(CollectionContext)

  return context.dialog
}

// Returns the subchapters given a parent chapter's leaf.
export const useSubchapters = (parentLeaf: string) => {
  const chapters = useChapters()

  return findSubchapters(chapters, parentLeaf)
}

// Returns the subchapters of a target chapter by looking through all the chapters and their children.
function findSubchapters(
  chapters: Chapter[] | undefined,
  targetLeaf: string
): Chapter[] | undefined {
  // If there are no more chapters to be found, return undefined.
  if (!chapters) {
    return chapters
  }

  // Look through all the given chapters.
  for (let i = 0; i < chapters.length; i++) {
    let curr = chapters[i]

    // If the current leaf matches the target leaf, then the parent has been found and its subchapters/children can be returned.
    if (curr?.leaf === targetLeaf) {
      return curr.children
    } else {
      // Else, the target chapter has not been found, so look through all this parent's subchapters/children.
      const subchapters = findSubchapters(chapters[i]?.children, targetLeaf)
      // If the target chapter was found, return its subchapters.
      if (subchapters) {
        return subchapters
      }
    }
  }

  return undefined
}

// Chapter type of collection chapters that comes from the backend.
type FlatChapters =
  | readonly ({
      readonly __typename?: "CollectionChapter" | undefined
    } & Pick<
      Dailp.CollectionChapter,
      "section" | "title" | "path" | "indexInParent"
    >)[]
  | null

// Converts a flat-list into a nested-list structure.
function flatToNested(
  chapters: FlatChapters | undefined
): Chapter[] | undefined {
  if (!chapters) {
    return undefined
  }

  // The final result.
  const nestedChapters: Chapter[] = []

  // Key: Chapter's leaf
  // Value: Chapter
  const leafToChapter = new Map<string, Chapter>()

  for (let i = 0; i < chapters.length; i++) {
    const curr = chapters[i]
    // The leaf is the last string in the chapter's path. i.e. cwkw.chaptera -> leaf: chaptera
    const leaf = curr?.path[curr?.indexInParent]
    if (curr && leaf) {
      // Create a new Chapter with the backend chapter's fields.
      let chapter: Chapter = {
        title: curr.title,
        leaf,
        indexInParent: curr.indexInParent,
        section: curr.section,
        children: undefined,
      }

      // Create a key-value pair with the chapter's leaf and the chapter itself.
      leafToChapter.set(leaf, chapter)

      // Get this chapter's parent leaf, which is the second to last string in its path. i.e. cwkw.chaptera -> parent leaf: cwkw
      const parentLeaf = curr.path[curr.indexInParent - 1]

      if (parentLeaf) {
        // Get the parent chapter itself from the parent leaf.
        const parentChapter = leafToChapter.get(parentLeaf)

        // If there is a parent chapter, add this chapter to its list of children.
        if (parentChapter) {
          parentChapter?.children
            ? parentChapter.children.push(chapter)
            : (parentChapter.children = [chapter])
        } else {
          // Otherwise, add it to the nested list of chapters (the final result).
          nestedChapters.push(chapter)
        }
      }
    }
  }
  return nestedChapters
}
