import parse, {
  HTMLReactParserOptions,
  attributesToProps,
  domToReact,
} from "html-react-parser"
import React from "react"
import { AudioPlayer, Button, Link } from "src/components"
import * as Dailp from "src/graphql/dailp"
import * as Wordpress from "src/graphql/wordpress"
import { usePreferences } from "src/preferences-context"
import { useRouteParams } from "src/renderer/PageShell"
import { AnnotatedForm } from "src/segment"
import { annotationSection } from "src/segment.css"
import { wordpressUrl } from "src/theme.css"
import { LevelOfDetail } from "src/types"
import * as printLessonCSS from "./print-lesson.css"
import { LexicalSearch } from "./lexical-search"

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
    const wordEmbedStyle = /\[(\w*):([0-9]*)-?([0-9]*)?:?(audio)?(join)?\]/ // [DocName:Start(-End?):?(audio?)(join?)]
    const referenceEmbedStyle = /\[(\w*)\]/ // [search | glossary]

    if ("data" in node) {
      const wordSegments = node.data.match(wordEmbedStyle)?.filter((x) => !!x)
      const referenceSegments = node.data.match(referenceEmbedStyle)?.filter((x) => !!x)

      if (
        wordSegments &&
        wordSegments.length > 2 &&
        (wordSegments[3] === "audio" || wordSegments[4] === "audio")
      ) {
        return (
          <PullAudio
            slug={wordSegments[1]!}
            first={parseInt(wordSegments[2]!)}
            last={wordSegments[3] !== "audio" ? parseInt(wordSegments[3]!) : undefined}
            combined={wordSegments[4] === "join" || wordSegments[5] === "join"}
          />
        )
      } else if (wordSegments && wordSegments.length > 2) {
        return (
          <PullWords
            slug={wordSegments[1]!}
            first={parseInt(wordSegments[2]!)}
            last={wordSegments.length >= 4 ? parseInt(wordSegments[3]!) : undefined}
          />
        )
      }

      if (referenceSegments && referenceSegments[1] === "search") {
        return (<LexicalSearch/>)
      }
    }

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
  const audioTracks = doc?.forms.map((form) => form.audioTrack)

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
  return (
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
  )
}
