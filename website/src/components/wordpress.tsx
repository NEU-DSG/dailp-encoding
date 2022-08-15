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
import { AnnotatedForm, DocumentParagraph, Segment } from "src/segment"
import { wordpressUrl } from "src/theme.css"
import {
  BasicMorphemeSegment,
  PhoneticRepresentation,
  TagSet,
  ViewMode,
  tagSetForMode,
} from "src/types"

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
            ></PullWords>
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

  const { viewMode, phoneticRepresentation } = usePreferences()

  const tagSet = tagSetForMode(viewMode)

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

  let morphemeSystem = Dailp.CherokeeOrthography.Learner
  if (viewMode === ViewMode.AnalysisDt) {
    morphemeSystem = Dailp.CherokeeOrthography.Crg
  } else if (viewMode === ViewMode.AnalysisTth) {
    morphemeSystem = Dailp.CherokeeOrthography.Taoc
  }

  const [{ data }] = Dailp.useDocSliceQuery({
    variables: { slug, start, end, morphemeSystem },
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
            viewMode={viewMode}
            tagSet={tagSet}
            phoneticRepresentation={phoneticRepresentation}
            pageImages={[]}
            wordPanelDetails={wordPanelInfo}
          />
        </div>
      ))}
    </>
  )
}
