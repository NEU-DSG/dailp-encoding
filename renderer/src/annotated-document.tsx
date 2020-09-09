import React, { Profiler, useState } from "react"
import { graphql, Link } from "gatsby"
import { useQuery, gql } from "@apollo/client"
import { styled } from "linaria/react"
import { Helmet } from "react-helmet"
import { useDialogState, Dialog, DialogBackdrop } from "reakit/Dialog"
import Layout from "./layout"
import { MorphemeDetails } from "./morpheme"
import { Segment } from "./segment"
import "typeface-gentium-basic"

/** A full annotated document, including all metadata and the translation(s) */
const AnnotatedDocumentPage = ({ data }) => {
  const doc = data.dailp.document
  const dialog = useDialogState()
  const [selectedMorpheme, setMorpheme] = useState([null, null])

  return (
    <Layout>
      <Helmet>
        <title>{doc.title} - Cherokee Reader</title>
      </Helmet>

      <AnnotatedDocument>
        <MorphemeDialog {...dialog} aria-label="Morpheme Details">
          <MorphemeDetails
            segment={selectedMorpheme[0]}
            gloss={selectedMorpheme[1]}
            dialog={dialog}
          />
        </MorphemeDialog>

        <header>
          <h2>{doc.title}</h2>
          <h3>{doc.source}</h3>
        </header>

        <AnnotationSection>
          {doc.segments.map((seg, i) => (
            <Segment
              key={`s${i}`}
              segment={seg}
              dialog={dialog}
              onOpenDetails={(segment, gloss) => {
                setMorpheme([segment, gloss])
              }}
            />
          ))}
        </AnnotationSection>

        <DocSection>
          {doc.translation.blocks.map((block, i) => (
            <p key={`t${i}`}>{block.segments.join(". ")}</p>
          ))}
        </DocSection>
      </AnnotatedDocument>
    </Layout>
  )
}
export default AnnotatedDocumentPage

export const query = graphql`
  query AnnotatedDocument($id: String!) {
    dailp {
      document(id: $id) {
        id
        title
        source
        translation {
          blocks {
            segments
          }
        }
        segments {
          __typename
          ... on Dailp_AnnotatedWord {
            ...WordFields
          }
          ... on Dailp_AnnotatedPhrase {
            ...BlockFields
          }
        }
      }
    }
  }
  fragment BlockFields on Dailp_AnnotatedPhrase {
    __typename
    parts {
      ... on Dailp_AnnotatedWord {
        ...WordFields
      }
    }
  }
  fragment WordFields on Dailp_AnnotatedWord {
    index
    source
    simplePhonetics
    phonemic
    morphemicSegmentation
    morphemeGloss
    englishGloss
  }
`

const MorphemeDialog = styled(Dialog)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border: 1px solid black;
  padding: 16px;
  max-height: 80vh;
  overflow-y: scroll;
`

const AnnotatedDocument = styled.main`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  font-size: 18;
`

const DocSection = styled.section`
  max-width: 1024px;
`

const AnnotationSection = styled(DocSection)`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
`
