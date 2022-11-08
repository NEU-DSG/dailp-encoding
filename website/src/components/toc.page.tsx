import { useState } from "react"
import Link from "src/components/link"
import { CollectionSection } from "src/graphql/dailp"
import {
  Chapter,
  useChapters,
} from "src/pages/edited-collections/edited-collection-context"
import { useRouteParams } from "src/renderer/PageShell"
import * as css from "./toc.css"

type TOCData = {
  title: string
  path: string
  children?: TOCData[]
}

interface Chapters {
  introChapters?: Chapter[]
  bodyChapters: Chapter[]
  creditChapters?: Chapter[]
}

const CollectionTOC = () => {
  const chapters = useChapters()

  if (!chapters) {
    return null
  }

  const introChapters = chapters.filter((c) => {
    return c.section === CollectionSection.Intro
  })

  const bodyChapters = chapters.filter((c) => {
    return c.section === CollectionSection.Body
  })

  return <TOC introChapters={introChapters} bodyChapters={bodyChapters} />
}

const TOC = ({ introChapters, bodyChapters }: Chapters) => {
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

export default CollectionTOC
