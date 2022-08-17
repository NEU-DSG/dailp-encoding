import parse, {
  HTMLReactParserOptions,
  attributesToProps,
  domToReact,
} from "html-react-parser"
import React, { useState } from "react"
import { useDialogState } from "reakit/Dialog"
import { Button, Link } from "src/components"
import * as Dailp from "src/graphql/dailp"
import * as Wordpress from "src/graphql/wordpress"
import { usePreferences } from "src/preferences-context"
import { AnnotatedForm } from "src/segment"
import { wordpressUrl } from "src/theme.css"
import { BasicMorphemeSegment } from "src/types"

interface Props {
  slug: string
}

const WordpressPage = ({ slug }: Props) => {
  const [{ data, fetching }] = Wordpress.usePageQuery({
    variables: { slug },
  })
  const wpPage = data?.page?.__typename === "Page" && data.page

  if (wpPage) {
    return <WordpressPageContents content={wpPage.content} />
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

export const WordpressPageContents = ({
  content,
}: {
  content: string | null
}) => {
  if (content) {
    const parsed = parse(content, parseOptions)
    return <>{parsed}</>
  } else {
    return null
  }
}

const parseOptions: HTMLReactParserOptions = {
  replace(node) {
    const style = /\[(\w*):([0-9]*)-?([0-9]*)?\]/ // [DocName:Start(-OptionalEnd)]

    if ("data" in node) {
      const segments = node.data.match(style)?.filter((x) => x !== undefined)
      if (segments) {
        if (segments?.length >= 3) {
          return (
            <PullWords
              slug={segments[1]!}
              start={parseInt(segments[2]!)}
              end={segments.length >= 4 ? parseInt(segments[3]!) : undefined}
            />
          )
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

const PullWords = (props: { slug: string; start: number; end?: number }) => {
  const slug = props.slug
  const start = props.start

  const end = props.end ? props.end : start + 1

  const [selectedMorpheme, setMorpheme] = useState<BasicMorphemeSegment | null>(
    null
  )

  const [dialogOpen, setDialogOpen] = useState(false)
  const openDetails = (morpheme: BasicMorphemeSegment) => {
    setMorpheme(morpheme)
    setDialogOpen(true)
  }

  const { levelOfDetail, cherokeeRepresentation } = usePreferences()

  const [selectedWord, setSelectedWord] =
    useState<Dailp.FormFieldsFragment | null>(null)

  const dialog = useDialogState({ animated: true })
  const selectAndShowWord = (content: Dailp.FormFieldsFragment | null) => {
    setSelectedWord(content)

    content ? dialog.show() : dialog.hide()
  }

  let wordPanelInfo = {
    currContents: selectedWord,
    setCurrContents: selectAndShowWord,
  }

  const [{ data }] = Dailp.useDocSliceQuery({
    variables: {
      slug: slug,
      start: start,
      end: end,
      morphemeSystem: cherokeeRepresentation,
    },
  })

  const docContents = data?.document
  if (!docContents?.forms) {
    return <>Loading...</>
  }
  return (
    <>
      {docContents.forms.map((form, i) => (
        <div>
          {i}
          <AnnotatedForm
            key={i}
            segment={form as any}
            onOpenDetails={openDetails}
            levelOfDetail={levelOfDetail}
            cherokeeRepresentation={cherokeeRepresentation}
            pageImages={[]}
            wordPanelDetails={wordPanelInfo}
          />
        </div>
      ))}
    </>
  )
}
