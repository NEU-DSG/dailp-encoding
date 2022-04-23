import parse, {
  Element,
  HTMLReactParserOptions,
  attributesToProps,
  domToReact,
} from "html-react-parser"
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
    }
    return undefined
  },
}
