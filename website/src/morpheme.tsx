import React from "react"
import { Clickable } from "reakit/Clickable"
import { DialogStateReturn } from "reakit/Dialog"
import { css, cx } from "linaria"
import { useQuery, gql } from "@apollo/client"
import _ from "lodash"
import { MdClose } from "react-icons/md"
import { AnchorLink } from "./link"
import theme from "./theme"
import { morphemeDisplayTag, TagSet } from "./types"
import { Link } from "gatsby"
import { glossaryRoute, morphemeTagId } from "./routes"

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
  // Use the right tag name from the jump.
  const matchingTag = morphemeDisplayTag(
    props.segment.matchingTag,
    props.tagSet
  )
  const gloss = matchingTag?.tag || props.segment.gloss
  const occurrences = <h3>Known Occurrences of "{gloss}"</h3>

  // Get the morpheme title and definition from the server.
  // TODO Only request the specific definition we need, not all three.
  const tag = useQuery(tagQuery, {
    skip: !props.segment.gloss,
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
      <h2 className={margined}>{matchingTag.title}</h2>
    ) : null
    content = (
      <>
        {matchingTag?.definition ? <p>{matchingTag.definition}</p> : null}
        <p>
          <Link to={glossaryRoute(tag.data.tag.id)}>View in glossary</Link>
        </p>
        {occurrences}
      </>
    )
  }

  return (
    <>
      {titleArea}
      <Clickable
        className={closeButton}
        role="button"
        aria-label="Close Dialog"
        onClick={props.dialog.hide}
      >
        <MdClose size={32} />
      </Clickable>
      <div className={cx(scrollable, padded)}>
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
  margin: ${theme.rhythm / 2}rem 1rem;
`

const padded = css`
  padding: ${theme.rhythm / 2}rem 1rem;
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
  isGlobal: boolean
  dialog: DialogStateReturn
}) => {
  const { data, loading, error } = useQuery(morphemeQuery, {
    skip: !props.gloss,
    variables: {
      morphemeId: props.isGlobal
        ? props.gloss
        : `${props.documentId}:${props.gloss}`,
    },
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
                        onClick={() => props.dialog.hide()}
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
      id
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
