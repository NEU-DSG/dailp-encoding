import React from "react"
import { Clickable } from "reakit/Clickable"
import { DialogStateReturn } from "reakit/Dialog"
import { css } from "linaria"
import { useQuery, gql } from "@apollo/client"
import _ from "lodash"
import { MdClose } from "react-icons/md"
import { AnchorLink } from "./link"
import theme from "./theme"

type BasicMorphemeSegment = NonNullable<
  GatsbyTypes.FormFieldsFragment["segments"]
>[0]

/** Specific details about some morpheme */
export const MorphemeDetails = (props: {
  documentId: string
  segment: BasicMorphemeSegment
  dialog: DialogStateReturn
}) => (
  <>
    <Clickable
      className={closeButton}
      role="button"
      aria-label="Close Dialog"
      onClick={props.dialog.hide}
    >
      <MdClose size={32} />
    </Clickable>
    <h3>Known Occurrences of "{props.segment?.gloss}"</h3>
    <SimilarMorphemeList
      documentId={props.documentId}
      gloss={props.segment?.gloss!}
      dialog={props.dialog}
    />
  </>
)

const closeButton = css`
  position: fixed;
  top: ${theme.rhythm / 2}rem;
  right: ${theme.rhythm / 2}rem;
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
  dialog: DialogStateReturn
}) => {
  const { data, loading, error } = useQuery(morphemeQuery, {
    skip: !props.gloss,
    variables: { morphemeId: `${props.documentId}:${props.gloss}` },
  })

  const tag = useQuery(tagQuery, {
    skip: !props.gloss,
    variables: { gloss: props.gloss },
  })

  if (loading || tag.loading) {
    return <p>Loading...</p>
  } else if (error || tag.error) {
    return <p>Error! {error ?? tag.error}</p>
  } else if (!data || !data.documents) {
    return <p>None Found</p>
  } else {
    const docs = data.documents as GatsbyTypes.Dailp_WordsInDocument[]
    const docTypes = _.groupBy(docs, "documentType")
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
                      <AnchorLink
                        to={`/documents/${word.documentId?.toLowerCase()}#w${
                          word.index
                        }`}
                        onClick={props.dialog.hide}
                      >
                        {word.documentId} #{word.index}
                      </AnchorLink>
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

    let tagDetails = null
    if (tag.data?.tag) {
      tagDetails = <p>{tag.data.tag.name}</p>
    }

    return (
      <>
        {tagDetails}
        {similarWords}
      </>
    )
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

const morphemeQuery = gql`
  query Morpheme($morphemeId: String!) {
    documents: morphemesByDocument(morphemeId: $morphemeId) {
      documentId
      documentType
      forms {
        index
        source
        normalizedSource
        documentId
        englishGloss
      }
    }
  }
`

const tagQuery = gql`
  query Tag($gloss: String!) {
    tag: morphemeTag(id: $gloss) {
      morphemeType
      name
      crg
    }
  }
`
