import React, { createContext, useContext } from "react"
import * as Dailp from "src/graphql/dailp"
import { useRouteParams } from "src/renderer/PageShell"

export type Chapter = {
  title: string
  leaf: string
  indexInParent: number
  section: Dailp.CollectionSection
  children?: Chapter[]
}

const ChaptersContext = createContext<Chapter[] | undefined>([])

export const ChaptersProvider = (props: { children: any }) => {
  const { collectionSlug } = useRouteParams()

  // Queries for chapters of a collection.
  const [{ data }] = Dailp.useEditedCollectionQuery({
    variables: { slug: collectionSlug! },
  })

  // Gets the converted nested chapters using the backend query.
  const chapters = flatToNested(data?.editedCollection?.chapters)

  return (
    <ChaptersContext.Provider value={chapters}>
      {props.children}
    </ChaptersContext.Provider>
  )
}

export const useChapters = () => {
  const context = useContext(ChaptersContext)

  return context
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
function flatToNested(chapters: FlatChapters | undefined) {
  if (!chapters) {
    return undefined
  }

  const nestedChapters: Chapter[] = []
  const stack: Chapter[] = []

  for (let i = 0; i < chapters.length; i++) {
    const curr = chapters[i]
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

      // If the index is 1, then this chapter has no parent chapter.
      if (curr.indexInParent === 1) {
        // Since this chapter has no parent, it needs to be added to the nested list.
        nestedChapters.push(chapter)
        // In case there was a chapter previously, we'll need to pop it off the stack since we now it no longer has any more children to add to it.
        stack.pop()
        // Push this chapter onto the stack to check for its children.
        stack.push(chapter)
      } else {
        // Get the item last pushed onto the stack.
        let lastPushed = stack[stack.length - 1]
        // Gets the second to last string element in the current chapter's path, which is this chapter's parent leaf.
        let parentChapterLeaf = curr.path[curr.indexInParent - 1]

        // Check if the current chapter's parent leaf matches the last pushed chapter's leaf.
        // If it doesn't, the last pushed chapter is not the parent and needs to be popped.
        // Continue through the stack until the parent of this chapter is found.
        while (parentChapterLeaf !== lastPushed?.leaf) {
          stack.pop()
          lastPushed = stack[stack.length - 1]
        }

        // Add this chapter to the parent chapter's list of children.
        if (lastPushed) {
          if (!lastPushed.children) {
            lastPushed.children = [chapter]
          } else {
            lastPushed?.children.push(chapter)
          }
        }

        // Push this chapter onto the stack to check for its children next.
        stack.push(chapter)
      }
    }
  }
  return nestedChapters
}
