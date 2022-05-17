import parse, {
  Element,
  HTMLReactParserOptions,
  attributesToProps,
  domToReact,
} from "html-react-parser"
import {
  NodeWithChildren,
  isText,
} from "html-react-parser/node_modules/domhandler"
import { indexOf } from "lodash"
import React from "react"
import Link from "src/components/link"
import * as Wordpress from "src/graphql/wordpress"
import { wordpressUrl } from "src/theme"

interface Props {
  slug: string
}

const WordpressPage = ({ slug }: Props) => {
  const [{ data, fetching }] = Wordpress.usePageQuery({
    variables: { slug },
  })
  const wpPage = data?.page?.__typename === "Page" && data.page

  if (wpPage) {
    return <WordpressContents content={wpPage.content ?? ""} />
  } else if (fetching) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    )
  } else {
    return null
  }
}

export default WordpressPage

export const WordpressContents = ({ content }: { content: string }) => {
  const parsed = parse(content, parseOptions)
  return <>{parsed}</>
}

const parseOptions: HTMLReactParserOptions = {
  replace(node) {
    if (isText(node) && node.data.startsWith("[")) {
      const text = node.data.trim()
      const doc = text.slice(1, 4)
      const start = text.slice(4, 5)
      // if (text.indexOf(":") !== -1)
      //   return mockfunction(
      //     doc,
      //     start,
      //     text.slice(text.indexOf(":") + 1, text.indexOf(":") + 1)
      //   )
      // return mockfunction(doc,start)
    }

    // Replace WordPress links with absolute local paths.
    // "https://wp.dailp.northeastern.edu/" => "/"
    if (
      "name" in node &&
      node.name === "a" &&
      "attribs" in node &&
      node.attribs &&
      node.attribs["href"]?.startsWith(wordpressUrl)
    ) {
      const props = attributesToProps(node.attribs)
      return (
        <Link {...props} href={props["href"]!.slice(wordpressUrl.length)}>
          {domToReact(node.children, parseOptions)}
        </Link>
      )
    } /*  else if (
      "name" in node &&
      "attribs" in node &&
      node.attribs &&
      node.attribs.startsWith?(wordpressUrl)
    ) {
      console.log(node.name)
    } */
    return undefined
  },
}
