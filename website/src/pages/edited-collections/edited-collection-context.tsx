import React, { createContext, useContext, useState } from "react"
import { DialogStateReturn, useDialogState } from "reakit"
import * as Dailp from "src/graphql/dailp"
import { useRouteParams } from "src/renderer/PageShell"

export type Chapter = {
  title: string
  slug: string
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

const CollectionContext = createContext<CollectionContext | undefined>(
  undefined
)

export const CollectionProvider = (props: { children: any }) => {
  const routeParams = useRouteParams()
  const collectionSlug = routeParams?.["collectionSlug"] as string | undefined

  // Queries for chapters of a collection.
  const [{ data }] = Dailp.useEditedCollectionQuery({
    variables: { slug: collectionSlug! },
    pause: !collectionSlug, // Don't run the query if we don't have a slug yet
  })

  // Add fallback query for when the singular query fails
  const [{ data: dailp }] = Dailp.useEditedCollectionsQuery()

  // Gets the converted nested chapters using the backend query.
  const chapters = flatToNested(data?.editedCollection?.chapters)

  // Fallback logic: use chapters from EditedCollectionsQuery if singular query fails
  let effectiveChapters = chapters
  if (!effectiveChapters || effectiveChapters.length === 0) {
    // Find collection in the plural query
    let collection = dailp?.allEditedCollections.find(
      ({ slug }) => slug === collectionSlug
    )

    // Try underscore/hyphen conversion if not found
    if (!collection && dailp?.allEditedCollections) {
      const alternativeSlug =
        collectionSlug?.replace("-", "_") || collectionSlug?.replace("_", "-")
      collection = dailp.allEditedCollections.find(
        ({ slug }) => slug === alternativeSlug
      )
    }

    // Convert fallback chapters to the expected Chapter format
    if (collection?.chapters && collection.chapters.length > 0) {
      effectiveChapters = collection.chapters
        .map((chapter) => {
          const slug = chapter.path[chapter.path.length - 1]
          if (!slug) return null // Skip chapters without valid slugs

          return {
            title: `Document ${slug}`, // Generate a title
            slug: slug, // Use last part of path as slug
            indexInParent: 1, // Default to 1 for flat structure
            section: Dailp.CollectionSection.Body, // Default to Body section
            children: undefined,
          }
        })
        .filter(Boolean) as Chapter[] // Remove null entries
    }
  }
  // Keeps track of the chapters selected SO FAR that have the same TOP parent (index of 1).
  const [selected, setSelected] = useState<Chapter[]>([])

  // Gets the dialog state for the TOC
  const dialog = useDialogState({
    animated: true,
  })

  return (
    <CollectionContext.Provider
      value={{ chapters: effectiveChapters, dialog, selected, setSelected }}
    >
      {props.children}
    </CollectionContext.Provider>
  )
}

export const useFunctions = () => {
  const context = useContext(CollectionContext)
  if (!context) {
    throw new Error("useFunctions must be used within a CollectionProvider")
  }
  const { selected, setSelected } = context

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
    return selected.map((chapter) => chapter.slug).includes(item.slug)
  }

  function lastSelected(item: Chapter) {
    if (selected[selected.length - 1]?.slug === item.slug) {
      return true
    }
    return false
  }

  return { onSelect, isSelected, lastSelected }
}

export const useChapters = () => {
  const context = useContext(CollectionContext)

  return context?.chapters
}

export const useDialog = () => {
  const context = useContext(CollectionContext)
  if (!context) {
    throw new Error("useDialog must be used within a CollectionProvider")
  }

  return context.dialog
}

// Returns the subchapters given a parent chapter's slug.
export const useSubchapters = (parentSlug: string) => {
  const chapters = useChapters()

  return findSubchapters(chapters, parentSlug)
}

// Returns the subchapters of a target chapter by looking through all the chapters and their children.
function findSubchapters(
  chapters: Chapter[] | undefined,
  targetSlug: string
): Chapter[] | undefined {
  // If there are no more chapters to be found, return undefined.
  if (!chapters) {
    return chapters
  }

  // Look through all the given chapters.
  for (let i = 0; i < chapters.length; i++) {
    let curr = chapters[i]

    // If the current slug matches the target slug, then the parent has been found and its subchapters/children can be returned.
    if (curr?.slug === targetSlug) {
      return curr.children
    } else {
      // Else, the target chapter has not been found, so look through all this parent's subchapters/children.
      const subchapters = findSubchapters(chapters[i]?.children, targetSlug)
      // If the target chapter was found, return its subchapters.
      if (subchapters) {
        return subchapters
      }
    }
  }

  return undefined
}

// Chapter type of collection chapters that comes from the backend.
type FlatChapters = NonNullable<
  Dailp.EditedCollectionQuery["editedCollection"]
>["chapters"]

// Converts a flat-list into a nested-list structure.
function flatToNested(chapters?: FlatChapters): Chapter[] | undefined {
  if (!chapters) {
    return undefined
  }

  // The final result.
  const nestedChapters: Chapter[] = []

  // Key: Chapter's slug
  // Value: Chapter
  const slugToChapter = new Map<string, Chapter>()

  // Sort chapters by path length (depth) first, then by indexInParent within each depth
  // This ensures parents are processed before children, and siblings are in correct order
  const sortedChapters = [...chapters].sort((a, b) => {
    const depthDiff = (a?.path.length ?? 0) - (b?.path.length ?? 0)
    if (depthDiff !== 0) return depthDiff
    return (a?.indexInParent ?? 0) - (b?.indexInParent ?? 0)
  })

  for (let i = 0; i < sortedChapters.length; i++) {
    const curr = sortedChapters[i]

    if (curr) {
      // Create a new Chapter with the backend chapter's fields.
      let chapter: Chapter = {
        title: curr.title,
        slug: curr.slug,
        indexInParent: curr.indexInParent,
        section: curr.section,
        children: undefined,
      }

      // Create a key-value pair with the chapter's slug and the chapter itself.
      slugToChapter.set(curr.slug, chapter)

      // Get this chapter's parent slug, which is the second to last string in its path. i.e. cwkw.chaptera -> parent slug: cwkw
      // For top-level chapters, path.length is 2 (collection, chapter), so parent is path[0]
      // For nested chapters, path.length > 2, so parent is path[path.length - 2]
      const parentSlug =
        curr.path.length > 1 ? curr.path[curr.path.length - 2] : undefined

      if (parentSlug) {
        // Get the parent chapter itself from the parent slug.
        const parentChapter = slugToChapter.get(parentSlug)

        // If there is a parent chapter, add this chapter to its list of children.
        if (parentChapter) {
          parentChapter?.children
            ? parentChapter.children.push(chapter)
            : (parentChapter.children = [chapter])
        } else {
          // Otherwise, add it to the nested list of chapters (the final result).
          nestedChapters.push(chapter)
        }
      } else {
        // If there's no parent (shouldn't happen for valid data), add to top level
        nestedChapters.push(chapter)
      }
    }
  }

  // Sort all chapters and their children by indexInParent to ensure correct order
  const sortChapters = (chapters: Chapter[]): Chapter[] => {
    return chapters
      .sort((a, b) => a.indexInParent - b.indexInParent)
      .map((chapter) => ({
        ...chapter,
        children: chapter.children ? sortChapters(chapter.children) : undefined,
      }))
  }

  return sortChapters(nestedChapters)
}
