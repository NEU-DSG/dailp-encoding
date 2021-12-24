import React from "react"
import { Clickable } from "reakit/Clickable"
import { DialogStateReturn } from "reakit/Dialog"
import { css } from "@emotion/react"
import { groupBy } from "lodash"
import { MdClose } from "react-icons/md"
import theme, { typography } from "./theme"
import { morphemeDisplayTag, TagSet } from "./types"
import Link from "next/link"
import { glossaryRoute, morphemeTagId } from "./routes"
import * as Dailp from "src/graphql/dailp"

type BasicMorphemeSegment = NonNullable<Dailp.FormFieldsFragment["segments"]>[0]

/** Specific details about some morpheme */
export const MorphemeDetails = (props: {
  documentId: string
  segment: BasicMorphemeSegment
  tagSet: TagSet
  dialog: DialogStateReturn
}) => {
  // Use the right tag name from the jump.
  const matchingTag = morphemeDisplayTag(
    props.segment.matchingTag,
    props.tagSet
  )
  const gloss = matchingTag?.tag || props.segment.gloss
  const occurrences = <h3>Known Occurrences of "{gloss}"</h3>

  // Get the morpheme title and definition from the server.
  // TODO Only request the specific definition we need, not all three.
  const [tag] = Dailp.useTagQuery({
    pause: !props.segment.gloss,
    variables: { gloss: props.segment.gloss },
  })

  let titleArea = null
  let content = occurrences
  if (tag.data && tag.data.tag) {
    const matchingTag = morphemeDisplayTag<{
      title: string
      tag: string
      definition: string
    }>(tag.data.tag, props.tagSet)
    titleArea = matchingTag?.title ? (
      <h2 css={margined}>{matchingTag.title}</h2>
    ) : null
    content = (
      <>
        {matchingTag?.definition ? <p>{matchingTag.definition}</p> : null}
        <p>
          <Link href={glossaryRoute(tag.data.tag.id)}>View in glossary</Link>
        </p>
        {occurrences}
      </>
    )
  }

  return (
    <>
      {titleArea}
      <Clickable
        css={closeButton}
        role="button"
        aria-label="Close Dialog"
        onClick={props.dialog.hide}
      >
        <MdClose size={32} />
      </Clickable>
      <div css={[scrollable, padded]}>
        {content}
        <SimilarMorphemeList
          documentId={props.documentId}
          gloss={props.segment.gloss!}
          dialog={props.dialog}
          isGlobal={!!props.segment.matchingTag}
        />
      </div>
    </>
  )
}

const margined = css`
  margin: ${typography.rhythm(1 / 2)} 1rem;
`

const padded = css`
  padding: ${typography.rhythm(1 / 2)} 1rem;
`

const scrollable = css`
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  width: 100%;
  max-height: 75vh;
  min-height: 20rem;
`

const closeButton = css`
  position: absolute;
  top: ${typography.rhythm(1 / 2)};
  right: ${typography.rhythm(1 / 2)};
  cursor: pointer;
  border: none;
  background: none;
  padding: 0;
`

/**
 * List of morphemes that share the given gloss, and all words that contain
 * those morphemes.
 */
const SimilarMorphemeList = (props: {
  gloss: string
  documentId: string
  isGlobal: boolean
  dialog: DialogStateReturn
}) => {
  const [{ data, fetching, error }] = Dailp.useMorphemeQuery({
    pause: !props.gloss,
    variables: {
      morphemeId: props.isGlobal
        ? props.gloss
        : `${props.documentId}:${props.gloss}`,
    },
  })

  if (fetching) {
    return <p>Loading...</p>
  } else if (error) {
    return <p>Error! {error}</p>
  } else if (!data || !data.documents) {
    return <p>None Found</p>
  } else {
    const docs = data.documents as Dailp.WordsInDocument[]
    const docTypes = groupBy(docs, "documentType")
    const similarWords = Object.entries(docTypes).map(([ty, documents]) => (
      <section key={ty}>
        <h4>{documentTypeToHeading(ty)}</h4>
        <ul>
          {documents.map((m: any, i: number) =>
            m.forms.map((word: any, j: number) => (
              <li key={i * 10000 + j}>
                {word.normalizedSource ?? word.source}:{" "}
                {word.englishGloss.join(", ")} (
                {word.documentId ? (
                  <>
                    {word.index ? (
                      <Link
                        href={`/documents/${word.documentId?.toLowerCase()}#w${
                          word.index
                        }`}
                      >
                        {word.documentId}
                      </Link>
                    ) : (
                      <>{word.documentId}</>
                    )}
                  </>
                ) : null}
                )
              </li>
            ))
          )}
        </ul>
      </section>
    ))

    return <>{similarWords}</>
  }
}

function documentTypeToHeading(ty: string) {
  if (ty === "REFERENCE") {
    return "In Reference Materials"
  } else if (ty === "CORPUS") {
    return "In Documents"
  } else {
    return "Miscellaneous"
  }
}
