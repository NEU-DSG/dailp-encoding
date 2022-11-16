import parse, {
  HTMLReactParserOptions,
  attributesToProps,
  domToReact,
} from "html-react-parser"
import React, { useState } from "react"
import { useDialogState } from "reakit/Dialog"
import { AudioPlayer, Button, Link } from "src/components"
import { useMediaQuery } from "src/custom-hooks"
import * as Dailp from "src/graphql/dailp"
import * as Wordpress from "src/graphql/wordpress"
import { usePreferences } from "src/preferences-context"
import { useLocation, useRouteParams } from "src/renderer/PageShell"
import { AnnotatedForm } from "src/segment"
import { annotationSection } from "src/segment.css"
import { mediaQueries } from "src/style/constants"
import { wordpressUrl } from "src/theme.css"
import { BasicMorphemeSegment, LevelOfDetail } from "src/types"
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
    const style = /\[(\$*)?(\w*):([0-9]*)-?([0-9]*)?\]/ // [DocName:Start(-OptionalEnd)]

    if ("data" in node) {
      const segments = node.data.match(style)?.filter((x) => !!x)

      if (segments && segments.length >= 3) {
        if (segments[1] === "$") {
          return (
            <PullAudio
              slug={segments[2]!}
              first={parseInt(segments[3]!)}
              last={segments.length >= 5 ? parseInt(segments[4]!) : undefined}
            />
          )
        } else {
          return (
            <PullWords
              slug={segments[1]!}
              first={parseInt(segments[2]!)}
              last={segments.length >= 4 ? parseInt(segments[3]!) : undefined}
            />
          )
        }
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
}) => {
  const { cherokeeRepresentation } = usePreferences()

  const [{ data }] = Dailp.useDocSliceQuery({
    variables: {
      slug: props.slug,
      // Convert our inclusive 1-indexed range into an exclusive 0-indexed range.
      start: props.first - 1,
      end: props.last ?? props.first,
      morphemeSystem: cherokeeRepresentation,
    },
  })

  const audioTracks = data?.document?.forms.map((f) => {
    return f.audioTrack
  })

  if (!audioTracks) {
    return <>Loading...</>
  }

  console.log(audioTracks)

  return (
    <>
      {audioTracks.map(
        (audio, i) =>
          audio && (
            <AudioPlayer
              audioUrl={audio.resourceUrl}
              slices={{
                start: audio.startTime!,
                end: audio.endTime!,
              }}
              showProgress
            />
          )
      )}
    </>
  )
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
      // Convert our inclusive 1-indexed range into an exclusive 0-indexed range.
      start: props.first - 1,
      end: props.last ?? props.first,
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
