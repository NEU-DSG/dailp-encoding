import { groupBy } from "lodash"
import React from "react"
import { MdClose } from "react-icons/md"
import { Clickable } from "reakit/Clickable"
import Link from "src/components/link"
import * as Dailp from "src/graphql/dailp"
import * as css from "./morpheme.css"
import { glossaryRoute } from "./routes"
import { TagSet, morphemeDisplayTag } from "./types"

type BasicMorphemeSegment = NonNullable<Dailp.FormFieldsFragment["segments"]>[0]

/** Specific details about some morpheme */
export const MorphemeDetails = (props: {
  documentId: string
  segment: BasicMorphemeSegment
  tagSet: TagSet
  hideDialog: () => void
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
      <h2 className={css.margined}>{matchingTag.title}</h2>
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
        className={css.closeButton}
        role="button"
        aria-label="Close Dialog"
        onClick={props.hideDialog}
      >
        <MdClose size={32} />
      </Clickable>
      <div className={css.scrollable}>
        {content}
        <SimilarMorphemeList
          documentId={props.documentId}
          gloss={props.segment.gloss!}
          hideDialog={props.hideDialog}
          isGlobal={!!props.segment.matchingTag}
        />
      </div>
    </>
  )
}

/**
 * List of morphemes that share the given gloss, and all words that contain
 * those morphemes.
 */
const SimilarMorphemeList = (props: {
  gloss: string
  documentId: string
  isGlobal: boolean
  hideDialog: () => void
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
