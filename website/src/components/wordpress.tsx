import * as domhandler from "domhandler"
import { isText } from "domhandler"
import parse, {
  DOMNode,
  HTMLReactParserOptions,
  attributesToProps,
  domToReact,
  htmlToDOM,
} from "html-react-parser"
import React from "react"
import { Tab, TabList, TabPanel, useTabState } from "reakit"
import { AudioPlayer, Button, Link } from "src/components"
import { usePreferences } from "src/contexts/preferences-context"
import * as Dailp from "src/graphql/dailp"
import * as Wordpress from "src/graphql/wordpress"
import { useRouteParams } from "src/renderer/PageShell"
import { collectionWordPath, documentWordPath } from "src/routes"
import { useScrollableTabState } from "src/scrollable-tabs"
import { devUrl, prodUrl, wordpressUrl } from "src/theme.css"
import { LevelOfDetail } from "src/types"
import { Glossary } from "../features/glossary-search"
import * as css from "../pages/documents/document.css"
import { AnnotatedForm } from "./display/segment"
import { annotationSection } from "./display/segment/segment.css"
import { LexicalSearch } from "./lexical-search"
import * as printLessonCSS from "./print-lesson.css"

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
  const { "*": slug } = useRouteParams()

  let parsed

  if (content) {
    // If the slug includes "lessons/", include a parent element that styles its children's elements for printed media.
    if (slug?.includes("lessons/")) {
      parsed = (
        <div className={printLessonCSS.lesson}>
          {parse(content, parseOptions)}
        </div>
      )
    } else {
      parsed = parse(content, parseOptions)
    }

    return <>{parsed}</>
  } else {
    return null
  }
}

const parseOptions: HTMLReactParserOptions = {
  replace(node) {
    if ("data" in node) {
      const referenceEmbedStyle = /\[(\w*)\]/ // [search | glossary]
      const wordEmbedStyle =
        /\[(\w*):([0-9]*)-?([0-9]*)?:?(audio)?(join)?(#)?(\w*)?\]/ // [DocName:Start(-OptionalEnd):?(audio?)(join?)#?OptionalChapterSlug?]

      const wordSegments = node.data.match(wordEmbedStyle)?.filter((x) => !!x)
      const referenceSegments = node.data
        .match(referenceEmbedStyle)
        ?.filter((x) => !!x)

      if (referenceSegments && referenceSegments[1] === "search") {
        return <LexicalSearch />
      } else if (referenceSegments && referenceSegments[1] === "glossary") {
        return <Glossary />
      }
      if (wordSegments) {
        return parseWord(wordSegments)
      }
    } else if ("name" in node && "attribs" in node) {
      if (node.name === "a") {
        return urlToAbsolutePath(node.attribs, node.children)
      } else if (node.name === "button") {
        return (
          <Button {...attributesToProps(node.attribs)}>
            {domToReact(node.children, parseOptions)}
          </Button>
        )
      } else if (
        node.name === "div" &&
        node.attribs["class"]?.includes("wpTabs")
      ) {
        return nodesToTabs(node.children)
      }
    }
    return undefined
  },
}

const PullAudio = (props: {
  slug: string
  /** First word number, 1-indexed **/
  first: number
  /** Last word number, 1-indexed inclusive **/
  last?: number
  // Whether multiple words should be combined into one playable audio or played separately.
  combined: boolean
}) => {
  const { cherokeeRepresentation } = usePreferences()

  const [{ data }] = Dailp.useDocSliceQuery({
    variables: {
      slug: props.slug,
      start: props.first,
      end: props.last ?? props.first + 1,
      morphemeSystem: cherokeeRepresentation,
    },
  })

  if (!data) {
    return null
  }

  const doc = data?.document

  // Gets the audio recording of this document slice.
  const docAudio = doc?.audioRecording
  // Gets the individual recordings of each word of this document slice.
  const audioTracks = doc?.forms.map((form) => form.ingestedAudioTrack)

  if (!docAudio || !audioTracks) {
    return null
  }

  // Return one audio track that contains all the words.
  if (props.combined) {
    return (
      <>
        {doc.forms.reduce((result, curr) => result + `${curr.source} `, "")}
        <AudioPlayer
          audioUrl={docAudio.resourceUrl}
          slices={{
            start: audioTracks[0]?.startTime!,
            end: audioTracks[audioTracks.length - 1]?.endTime!,
          }}
          showProgress
        />
      </>
    )
  } else {
    // If the audio should not be combined, return separate audio tracks for each word.
    return (
      <>
        {audioTracks.map(
          (audio, i) =>
            audio && (
              <>
                {`${doc.forms[i]?.source}`}
                <AudioPlayer
                  key={i}
                  audioUrl={audio.resourceUrl}
                  slices={{
                    start: audio.startTime!,
                    end: audio.endTime!,
                  }}
                  showProgress
                />
              </>
            )
        )}
      </>
    )
  }
}

const PullWords = (props: {
  slug: string
  /** First word number, 1-indexed **/
  first: number
  /** Last word number, 1-indexed inclusive **/
  last?: number
  /** Chapter slug of contained word as opposed to document slug if the citation is referenced within a collection*/
  chapterSlug?: string
}) => {
  const { levelOfDetail, cherokeeRepresentation } = usePreferences()

  let wordPanelInfo = {
    currContents: null,
    setCurrContents: () => {},
  }

  const [{ data }] = Dailp.useDocSliceQuery({
    variables: {
      slug: props.slug,
      start: props.first,
      end: props.last ?? props.first + 1,
      morphemeSystem: cherokeeRepresentation,
    },
  })

  const docContents = data?.document
  if (!docContents?.forms) {
    return <>Loading...</>
  }

  const annotationStyle =
    levelOfDetail > LevelOfDetail.Pronunciation
      ? annotationSection.wordParts
      : annotationSection.story

  let documentCitation = docContents.title + ", word " + props.first

  if (props.last) {
    documentCitation =
      docContents.title + ", words " + props.first + " – " + props.last
  }

  const { collectionSlug } = useRouteParams()

  return (
    <>
      <div className={annotationStyle}>
        {docContents.forms.map((form, i) => (
          <AnnotatedForm
            key={i}
            segment={form as any}
            onOpenDetails={() => {}}
            levelOfDetail={levelOfDetail}
            cherokeeRepresentation={cherokeeRepresentation}
            pageImages={[]}
            wordPanelDetails={wordPanelInfo}
          />
        ))}
      </div>
      <div>
        <i>
          {collectionSlug && props.chapterSlug ? (
            <Link
              href={collectionWordPath(
                collectionSlug,
                props.chapterSlug,
                props.first
              )}
            >
              {documentCitation}
            </Link>
          ) : (
            <Link href={documentWordPath(props.slug, props.first)}>
              {documentCitation}
            </Link>
          )}
        </i>
      </div>
    </>
  )
}

function parseWord(segments: string[]): JSX.Element | undefined {
  if (
    segments.length > 2 &&
    (segments[3] === "audio" || segments[4] === "audio")
  ) {
    return (
      <PullAudio
        slug={segments[1]!}
        first={parseInt(segments[2]!)}
        last={segments[3] !== "audio" ? parseInt(segments[3]!) : undefined}
        combined={segments[4] === "join" || segments[5] === "join"}
      />
    )
  } else if (segments.length > 2) {
    return (
      <PullWords
        slug={segments[1]!}
        first={parseInt(segments[2]!)}
        last={
          segments.length < 4 || segments[4] === "#"
            ? undefined
            : parseInt(segments[3]!)
        }
        chapterSlug={segments.length >= 4 ? segments[5]! : undefined}
      />
    )
  }
  return undefined
}

/** Replace DAILP links in an element with absolute local paths.
 * @param attribs the attributes of the current element
 * @param children the children of the current element
 * @returns {JSX.Element} a Link with the href prop as a local path and containing the provided children
 *
 * "https://wp.dailp.northeastern.edu/" => "/"
 * "https://dev.dailp.northeastern.edu/" => "/"
 * "https://dailp.northeastern.edu/" => "/"
 */
function urlToAbsolutePath(
  attribs: { [name: string]: string },
  children: any
): JSX.Element {
  const props = attributesToProps(attribs)

  if (props["href"]?.startsWith(wordpressUrl)) {
    props["href"] = props["href"].slice(wordpressUrl.length)
  } else if (props["href"]?.startsWith(devUrl)) {
    props["href"]?.slice(devUrl.length)
  } else if (props["href"]?.startsWith(prodUrl)) {
    props["href"].slice(prodUrl.length)
  }

  return <Link {...props}>{domToReact(children, parseOptions)}</Link>
}

function nodesToTabs(node: domhandler.Node[]) {
  const headingStyle = /\|(.*)\|/

  const tabList = node.filter((value) => {
    if (!isText(value)) return false
    let headings = value.data.match(headingStyle)?.filter((x) => !!x)
    return headings && headings.length > 1
  })
  const init: DOMNode[][] = []
  const tabPanelList = node.reduce((prev, curr) => {
    if (isText(curr) && tabList.includes(curr)) {
      prev.push([])
    } else {
      prev[prev.length - 1]?.push(curr)
    }
    return prev
  }, init)
  const tabState = useScrollableTabState()
  return (
    <>
      <TabList {...tabState} className={css.docTabs} aria-label="My tabs">
        {tabList.map((t, i) => {
          return (
            isText(t) && (
              <Tab id={"tab-" + i} className={css.docTab} {...tabState}>
                {t.data.match(headingStyle)?.filter((x) => !!x)[1]}
              </Tab>
            )
          )
        })}
      </TabList>
      {tabPanelList.map((p, i) => {
        return (
          <TabPanel
            id={"tabPanel" + i}
            tabId={"tab-" + i}
            className={css.docTabPanel}
            {...tabState}
          >
            {domToReact(p, parseOptions)}
          </TabPanel>
        )
      })}
    </>
  )
}
