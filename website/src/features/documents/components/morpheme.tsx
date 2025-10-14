import { groupBy } from "lodash-es"
import React from "react"
import { ReactNode } from "react"
import { MdClose } from "react-icons/md/index"
import * as Dailp from "src/graphql/dailp"
import { documentWordPath, glossaryRoute } from "src/routes"
import { IconButton, Link } from "src/ui"
import * as css from "./morpheme.css"

type BasicMorphemeSegment = NonNullable<Dailp.FormFieldsFragment["segments"]>[0]

/** Specific details about some morpheme */
export const MorphemeDetails = (props: {
  documentId: string
  segment: BasicMorphemeSegment
  cherokeeRepresentation: Dailp.CherokeeOrthography
  hideDialog: () => void
}) => {
  // Use the right tag name from the jump.
  const matchingTag = props.segment.matchingTag
  const gloss = matchingTag?.tag || props.segment.gloss
  const occurrences = <h3>Known Occurrences of "{gloss}"</h3>

  // Get the morpheme title and definition from the server.
  // TODO Only request the specific definition we need, not all three.
  const [tag] = Dailp.useTagQuery({
    pause: !props.segment.gloss,
    variables: {
      gloss: props.segment.gloss,
      system: props.cherokeeRepresentation,
    },
  })

  let titleArea: ReactNode | null = null
  let content = occurrences
  if (tag.data?.tag) {
    const matchingTag = tag.data.tag
    titleArea = matchingTag?.title ? (
      <h2 className={css.margined}>{matchingTag.title}</h2>
    ) : null
    content = (
      <>
        {matchingTag?.definition ? <p>{matchingTag.definition}</p> : null}
        <p>
          <Link href={glossaryRoute(tag.data.tag.tag)}>View in glossary</Link>
        </p>
        {occurrences}
      </>
    )
  }

  return (
    <>
      {titleArea}
      <IconButton
        className={css.closeButton}
        aria-label="Close Dialog"
        onClick={props.hideDialog}
      >
        <MdClose size={32} />
      </IconButton>
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
      documentId: props.isGlobal ? null : props.documentId,
      morphemeGloss: props.gloss,
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
                {!!word.document ? (
                  <>
                    {word.index ? (
                      <Link
                        href={documentWordPath(word.document?.slug, word.index)}
                      >
                        {word.document.slug.toUpperCase()}
                      </Link>
                    ) : (
                      <>{word.document.slug.toUpperCase()}</>
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
