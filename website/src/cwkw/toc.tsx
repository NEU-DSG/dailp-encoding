import Link from "src/components/link"
import { listItem, orderedList } from "./toc.css"

type TOCData = {
  title: string
  path: string
  children?: TOCData[]
}

export const TOC = (props: { tocData: TOCData[] }) => (
  <ol className={orderedList}>
    {props.tocData.map((items, index) => (
      <li className={listItem}>
        <Link href={items.path}>{items.title}</Link>
        {items.children ? <TOC tocData={items.children}></TOC> : null}
      </li>
    ))}
  </ol>
)
