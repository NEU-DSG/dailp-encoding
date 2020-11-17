import React from "react"
import { Clickable } from "reakit/Clickable"
import { DialogStateReturn } from "reakit/Dialog"
import { styled } from "linaria/react"
import { useQuery, gql } from "@apollo/client"
import _ from "lodash"
import { MdClose } from "react-icons/md"
import { AnchorLink } from "./link"

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
    <CloseButton
      role="button"
      aria-label="Close Dialog"
      onClick={props.dialog.hide}
    >
      <MdClose size={32} />
    </CloseButton>
    <h4>Known Occurrences of "{props.segment?.gloss}"</h4>
    <SimilarMorphemeList documentId={props.documentId} gloss={props.segment?.gloss!} dialog={props.dialog} />
  </>
)

const CloseButton = styled(Clickable)`
  position: fixed;
  top: 0.5rem;
  right: 0.5rem;
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
    variables: { gloss: props.gloss, documentId: props.documentId },
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
        <h5>{documentTypeToHeading(ty)}</h5>
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
  query Morpheme($gloss: String!, $documentId: String!) {
    documents: morphemesByDocument(gloss: $gloss, documentId: $documentId) {
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
