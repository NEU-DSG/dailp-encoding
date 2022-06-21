import parse, {
  HTMLReactParserOptions,
  attributesToProps,
  domToReact,
} from "html-react-parser"
import React from "react"
import { Button, Link } from "src/components"
import * as Wordpress from "src/graphql/wordpress"
import { wordpressUrl } from "src/theme.css"

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
    const style = /\[(\w*):([0-9]*)-?([0-9]*)?\]/ // [DocName:Start(-OptionalEnd)]

    if ("data" in node) {
      const segments = node.data.match(style)?.filter((x) => x !== undefined)
      if (segments) {
        console.log(segments)

        if (segments?.length === 4) {
          return pullWords(segments[1]!, segments[2]!, segments[3]!)
        }
        if (segments?.length === 3) {
          return pullWords(segments[1]!, segments[2]!)
        }
      }
    }

    // }

    if ("name" in node && "attribs" in node) {
      // Replace WordPress links with absolute local paths.
      // "https://wp.dailp.northeastern.edu/" => "/"
      if (node.name === "a") {
        const props = attributesToProps(node.attribs)
        if (props["href"]?.startsWith(wordpressUrl)) {
          props["href"] = props["href"].slice(wordpressUrl.length)
        }
        return <Link {...props}>{domToReact(node.children, parseOptions)}</Link>
      } else if (node.name === "button") {
        return (
          <Button {...attributesToProps(node.attribs)}>
            {domToReact(node.children, parseOptions)}
          </Button>
        )
      }
    }
    return undefined
  },
}

const pullWords = (
  docName: string,
  start: string,
  end?: string
): JSX.Element => {
  return <div>full array</div>
}
