import React, { useState, useEffect } from "react"
import { graphql, Link } from "gatsby"
import { styled } from "linaria/react"
import { Helmet } from "react-helmet"
import slugify from "slugify"
import { useDialogState, Dialog } from "reakit/Dialog"
import { Radio, RadioGroup, useRadioState } from "reakit/Radio"
import Layout from "../layout"
import { MorphemeDetails } from "../morpheme"
import { Segment } from "../segment"
import {
  AnnotatedDocumentQuery,
  Dailp_AnnotatedSeg,
  Dailp_MorphemeSegment,
  Dailp_Block,
} from "../../graphql-types"

/** A full annotated document, including all metadata and the translation(s) */
const AnnotatedDocumentPage = (p: { data: AnnotatedDocumentQuery }) => {
  const doc = p.data.dailp.document!
  const collectionSlug = slugify(doc.collection!, { lower: true })
  const dialog = useDialogState()
  const [
    selectedMorpheme,
    setMorpheme,
  ] = useState<Dailp_MorphemeSegment | null>(null)
  const [experienceLevel, setLevel] = useState(ExperienceLevel.Beginner)

  return (
    <Layout>
      <Helmet>
        <title>{doc.title} - Cherokee Reader</title>
      </Helmet>

      <AnnotatedDocument>
        <MorphemeDialog {...dialog} aria-label="Morpheme Details">
          <MorphemeDetails segment={selectedMorpheme} dialog={dialog} />
        </MorphemeDialog>

        <header>
          <h2>{doc.title}</h2>
          <Link to={`/collections/${collectionSlug}`}>
            <h3>{doc.collection}</h3>
          </Link>
        </header>

        <ExperiencePicker onPick={level => setLevel(level)} />

        <AnnotationSection>
          {doc.translatedSegments?.map((seg, i) => (
            <Segment
              key={`s${i}`}
              segment={seg.source as Dailp_AnnotatedSeg}
              dialog={dialog}
              onOpenDetails={setMorpheme}
              level={experienceLevel}
              translations={seg.translation as Dailp_Block}
            />
          ))}
        </AnnotationSection>
      </AnnotatedDocument>
    </Layout>
  )
}
export default AnnotatedDocumentPage

export enum ExperienceLevel {
  Beginner = 0,
  Intermediate = 1,
  Advanced = 2,
}

const ExperiencePicker = (props: {
  onPick: (exp: ExperienceLevel) => void
}) => {
  const radio = useRadioState({ state: ExperienceLevel.Beginner })
  useEffect(() => {
    props.onPick(radio.state as ExperienceLevel)
  }, [radio.state])

  return (
    <RadioGroup {...radio}>
      {Object.keys(ExperienceLevel)
        .filter(l => isNaN(Number(l)))
        .map((level: string) => (
          <label key={level}>
            <Radio
              {...radio}
              value={ExperienceLevel[level as keyof typeof ExperienceLevel]}
            />
            {level}
          </label>
        ))}
    </RadioGroup>
  )
}

export const query = graphql`
  query AnnotatedDocument($id: String!) {
    dailp {
      document(id: $id) {
        id
        title
        collection
        translatedSegments {
          source {
            ... on Dailp_AnnotatedForm {
              ...FormFields
            }
            ... on Dailp_AnnotatedPhrase {
              ...BlockFields
            }
          }
          translation {
            segments
          }
        }
      }
    }
  }
  fragment BlockFields on Dailp_AnnotatedPhrase {
    ty
    index
    parts {
      ... on Dailp_AnnotatedForm {
        ...FormFields
      }
    }
  }
  fragment FormFields on Dailp_AnnotatedForm {
    index
    source
    simplePhonetics
    phonemic
    segments {
      morpheme
      gloss
    }
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

export const AnnotationSection = styled(DocSection)`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
`
