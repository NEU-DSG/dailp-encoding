import React from "react"
import { Link } from "gatsby"
import { useQuery, gql } from "@apollo/client"

/** Specific details about some morpheme */
export const MorphemeDetails = (props: {
  segment: string
  gloss: string
  dialog: any
}) => (
  <>
    <h4>{props.gloss} - Known surface forms</h4>
    <SimilarMorphemeList gloss={props.gloss} dialog={props.dialog} />
  </>
)

/**
 * List of morphemes that share the given gloss, and all words that contain
 * those morphemes.
 */
const SimilarMorphemeList = (props: { gloss: string; dialog: any }) => {
  const { data, loading } = useQuery(morphemeQuery, {
    skip: !props.gloss,
    variables: { gloss: props.gloss },
  })

  if (loading) {
    return <p>Loading...</p>
  } else if (!data || !data.morphemes) {
    return <p>None Found</p>
  } else {
    return data.morphemes.map((m, i) => (
      <div>
        <p key={i}>{m.morpheme}</p>
        <ul>
          {m.words.map(word => (
            <li>
              <Link
                to={`/documents/${word.documentId.toLowerCase()}#w${
                  word.index
                }`}
                onClick={() => props.dialog.hide()}
              >
                {word.source}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    ))
  }
}

const morphemeQuery = gql`
  query Morpheme($gloss: String!) {
    morphemes(gloss: $gloss) {
      morpheme
      words {
        index
        source
        documentId
      }
    }
  }
`
