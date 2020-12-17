import React from "react"
import { Clickable } from "reakit/Clickable"
import { DialogStateReturn } from "reakit/Dialog"
import { css } from "linaria"
import { useQuery, gql } from "@apollo/client"
import _ from "lodash"
import { MdClose } from "react-icons/md"
import { AnchorLink } from "./link"
import theme from "./theme"
import { morphemeDisplayTag, TagSet } from "./types"

type BasicMorphemeSegment = NonNullable<
  GatsbyTypes.FormFieldsFragment["segments"]
>[0]

/** Specific details about some morpheme */
export const MorphemeDetails = (props: {
  documentId: string
  segment: BasicMorphemeSegment
  tagSet: TagSet
  dialog: DialogStateReturn
}) => {
  return (
    <>
      <Clickable
        className={closeButton}
        role="button"
        aria-label="Close Dialog"
        onClick={props.dialog.hide}
      >
        <MdClose size={32} />
      </Clickable>
      <TagDetails segment={props.segment} tagSet={props.tagSet} />
      <SimilarMorphemeList
        documentId={props.documentId}
        gloss={props.segment?.gloss!}
        dialog={props.dialog}
      />
    </>
  )
}

const TagDetails = (props: {
  segment: BasicMorphemeSegment
  tagSet: TagSet
}) => {
  const tag = useQuery(tagQuery, {
    skip: !props.segment.gloss,
    variables: { gloss: props.segment.gloss },
  })
  if (tag.data) {
    const matchingTag = morphemeDisplayTag(tag.data.tag, props.tagSet)
    const gloss = matchingTag?.tag || props.segment.gloss
    return (
      <>
        {matchingTag?.title ? <h2>{matchingTag.title}</h2> : null}
        {matchingTag?.definition ? <p>{matchingTag.definition}</p> : null}
        <h3>Known Occurrences of "{gloss}"</h3>
      </>
    )
  } else {
    return <h3>Known Occurrences of "{props.segment.gloss}"</h3>
  }
}

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

  if (loading) {
    return <p>Loading...</p>
  } else if (error) {
    return <p>Error! {error}</p>
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
      taoc {
        tag
        title
        definition
      }
      crg {
        tag
        title
        definition
      }
      learner {
        tag
        title
        definition
      }
    }
  }
`
