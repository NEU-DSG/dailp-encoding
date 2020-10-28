import React from "react"
import { Link } from "gatsby"
import { Button } from "reakit/Button"
import { DialogStateReturn } from "reakit/Dialog"
import { styled } from "linaria/react"
import { useQuery, gql } from "@apollo/client"
import _ from "lodash"

type BasicMorphemeSegment = NonNullable<
  GatsbyTypes.FormFieldsFragment["segments"]
>[0]

/** Specific details about some morpheme */
export const MorphemeDetails = (props: {
  segment: BasicMorphemeSegment
  dialog: DialogStateReturn
}) => (
  <>
    <CloseButton onClick={() => props.dialog.hide()}>Close</CloseButton>
    <h4>Known Occurrences of "{props.segment?.gloss}"</h4>
    <SimilarMorphemeList gloss={props.segment?.gloss!} dialog={props.dialog} />
  </>
)

const CloseButton = styled(Button)`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
`

/**
 * List of morphemes that share the given gloss, and all words that contain
 * those morphemes.
 */
const SimilarMorphemeList = (props: {
  gloss: string
  dialog: DialogStateReturn
}) => {
  const { data, loading } = useQuery(morphemeQuery, {
    skip: !props.gloss,
    variables: { gloss: props.gloss },
  })

  const tag = useQuery(tagQuery, {
    skip: !props.gloss,
    variables: { gloss: props.gloss },
  })

  if (loading || tag.loading) {
    return <p>Loading...</p>
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
            m.words.map((word: any, j: number) => (
              <li key={`${i}-${j}`}>
                {word.source}: {word.englishGloss.join(", ")} (
                {word.documentId ? (
                  <>
                    {word.index ? (
                      <Link
                        to={`/documents/${word.documentId?.toLowerCase()}#w${
                          word.index
                        }`}
                        onClick={() => props.dialog.hide()}
                      >
                        {word.documentId} #{word.index}
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
  } else {
    return "In Documents"
  }
}

const morphemeQuery = gql`
  query Morpheme($gloss: String!) {
    documents: morphemesByDocument(gloss: $gloss) {
      documentId
      documentType
      words {
        index
        source
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
