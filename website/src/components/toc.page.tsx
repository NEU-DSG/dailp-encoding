import { useState } from "react"
import Link from "src/components/link"
import * as Dailp from "src/graphql/dailp"
import { useRouteParams } from "src/renderer/PageShell"
import * as css from "./toc.css"

type TOCData = {
  title: string
  path: string
  children?: TOCData[]
}

type Chapter = {
  title: string
  leaf: string
  indexInParent: number
  children?: Chapter[]
}

interface Chapters {
  introChapters?: Chapter[]
  bodyChapters: Chapter[]
}

export const TOC = ({ introChapters, bodyChapters }: Chapters) => {
  const { collectionSlug } = useRouteParams()

  const chapterPath = `${collectionSlug}/chapters/`

  const [selected, setSelected] = useState<Chapter | null>(null)

  return (
    <>
      {/* Intro Chapters */}
      {introChapters && (
        <ol className={css.numberedOrderedList}>
          {introChapters?.map((item) => (
            <>
              <li key={item.leaf} className={css.listItem}>
                <Link
                  href={`${chapterPath}${item.leaf}`}
                  className={css.link}
                  onClick={() => {
                    if (selected === item) {
                      setSelected(null)
                    } else {
                      setSelected(item)
                    }
                  }}
                >
                  {item.title}
                </Link>
              </li>
              <hr className={css.divider} />
            </>
          ))}
        </ol>
      )}
      {/* Body Chapters */}
      {bodyChapters && (
        <ol className={css.orderedList}>
          {bodyChapters?.map((item) => (
            <>
              <li key={item.leaf} className={css.listItem}>
                <Link
                  href={`#`}
                  className={css.link}
                  onClick={() => {
                    if (selected === item) {
                      setSelected(null)
                    } else {
                      setSelected(item)
                    }
                  }}
                >
                  {item.title}
                </Link>

                {/* If this item is selected, show its child chapters if there are any. */}
                {item === selected && item.children?.length ? (
                  <TOC bodyChapters={item.children} />
                ) : null}
              </li>
              <hr className={css.divider} />
            </>
          ))}
        </ol>
      )}
    </>
  )
}

const data1: TOCData = {
  title: "1",
  path: "/1",
}

const data2: TOCData = {
  title: "2",
  path: "/1",
}
const data3: TOCData = {
  title: "3",
  path: "/1",
}
const data4: TOCData = {
  title: "4",
  path: "/1",
}
const data5: TOCData = {
  title: "5",
  path: "/1",
}
const data6: TOCData = {
  title: "6",
  path: "/1",
}
const data7: TOCData = {
  title: "7",
  path: "/1",
}
const data8: TOCData = {
  title: "8",
  path: "/1",
}
const data9: TOCData = {
  title: "9",
  path: "/1",
}
const data10: TOCData = {
  title: "10",
  path: "/1",
  children: [data1, data2, data3, data4, data5, data6, data7, data8, data9],
}

const data: TOCData[] = [
  data1,
  data2,
  data3,
  data4,
  data5,
  data6,
  data7,
  data8,
  data9,
  data10,
]

// Gets the chapters from a query.
export const CollectionTOC = () => {
  const { collectionSlug } = useRouteParams()

  const [{ data }] = Dailp.useEditedCollectionQuery({
    variables: { slug: collectionSlug! },
  })

  if (!data) {
    return <>Loading...</>
  }

  const collection = data.editedCollection

  const introChapters = collection?.chapters?.filter(
    (chapter) => chapter.section == Dailp.CollectionSection.Intro
  )

  const bodyChapters = collection?.chapters?.filter(
    (chapter) => chapter.section == Dailp.CollectionSection.Body
  )

  const nestedIntroChapters = flatToNested(introChapters)
  const nestedBodyChapters = flatToNested(bodyChapters)

  return (
    <TOC
      introChapters={nestedIntroChapters}
      bodyChapters={nestedBodyChapters}
    />
  )
}

type FlatChapter =
  | ({
      readonly __typename?: "CollectionChapter" | undefined
    } & Pick<
      Dailp.CollectionChapter,
      "section" | "title" | "path" | "indexInParent"
    >)[]
  | undefined

// Converts a flat-list into a nested-list structure.
function flatToNested(chapters: FlatChapter) {
  if (!chapters) {
    return []
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
        children: [],
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
        lastPushed?.children?.push(chapter)
        // Push this chapter onto the stack to check for its children next.
        stack.push(chapter)
      }
    }
  }

  return nestedChapters
}

export default CollectionTOC
