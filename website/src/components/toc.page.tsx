import Link from "src/components/link"
import * as Dailp from "src/graphql/dailp"
import { useRouteParams } from "src/renderer/PageShell"
import { listItem, numberedOrderedList, orderedList } from "./toc.css"

type TOCData = {
  title: string
  path: string
  children?: TOCData[]
}

export const TOC = (props: { slug: string }) => {
  const [{ data }] = Dailp.useEditedCollectionQuery({
    variables: { slug: props.slug! },
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
  return (
    <>
      <ol className={numberedOrderedList}>
        {introChapters?.map((items, index) => (
          <li>
            <Link href={items.path.join("/")}>{items.title}</Link>
          </li>
        ))}
      </ol>
      <ol className={orderedList}>
        {bodyChapters?.map((items, index) => (
          <li className={listItem}>
            <Link href={items.path.join("/")}>{items.title}</Link>
            {/* {items.children ? <TOC bodyChapters={items.children}></TOC> : null} */}
          </li>
        ))}
      </ol>
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

// const Tox1 = () => {
//   const slug = "cwkw"
//   const [{ data }] = Dailp.useEditedCollectionQuery({
//     variables: { slug: slug! },
//   })

//   if (!data) {
//     return <>Loading...</>
//   }

//   const collection = data.editedCollection

//   const introChapters = collection?.chapters?.filter(
//     (chapter) => chapter.section == Dailp.CollectionSection.Intro
//   )

//   const bodyChapters = collection?.chapters?.filter(
//     (chapter) => chapter.section == Dailp.CollectionSection.Body
//   )

//   return <TOC introChapters={introChapters} bodyChapters={bodyChapters}></TOC>
// }

export default TOC
