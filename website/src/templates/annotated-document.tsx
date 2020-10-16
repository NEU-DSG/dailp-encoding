import React, { useState, useEffect } from "react"
import { graphql, Link } from "gatsby"
import { styled } from "linaria/react"
import { Helmet } from "react-helmet"
import slugify from "slugify"
import { useDialogState, Dialog, DialogBackdrop } from "reakit/Dialog"
import {
  Radio,
  RadioGroup,
  useRadioState,
  RadioStateReturn,
} from "reakit/Radio"
import Layout from "../layout"
import { MorphemeDetails } from "../morpheme"
import { Segment, BasicMorphemeSegment } from "../segment"
import Cookies from "js-cookie"
import { fullWidth, largeDialog } from "../theme"

/** A full annotated document, including all metadata and the translation(s) */
const AnnotatedDocumentPage = (p: {
  data: GatsbyTypes.AnnotatedDocumentQuery
}) => {
  const doc = p.data.dailp.document!
  const collectionSlug = slugify(doc.collection ?? "", { lower: true })
  const dialog = useDialogState()
  const [selectedMorpheme, setMorpheme] = useState<BasicMorphemeSegment | null>(
    null
  )
  const experienceLevel = useRadioState({
    state: Number.parseInt(Cookies.get("experienceLevel") ?? "0"),
  })

  // Save the selected experience level throughout the session.
  useEffect(() => {
    Cookies.set("experienceLevel", experienceLevel.state!.toString())
  }, [experienceLevel.state])

  const tagSet =
    experienceLevel.state! > ExperienceLevel.Learner
      ? TagSet.Dailp
      : TagSet.Learner

  return (
    <Layout>
      <Helmet>
        <title>{doc.title} - Cherokee Reader</title>
      </Helmet>

      <AnnotatedDocument>
        <MorphemeDialogBackdrop {...dialog}>
          <MorphemeDialog {...dialog} aria-label="Morpheme Details">
            {selectedMorpheme ? (
              <MorphemeDetails segment={selectedMorpheme} dialog={dialog} />
            ) : null}
          </MorphemeDialog>
        </MorphemeDialogBackdrop>

        <header>
          <h2>{doc.title}</h2>
          <Link to={`/collections/${collectionSlug}`}>
            <h3>{doc.collection}</h3>
          </Link>
        </header>

        <ExperiencePicker radio={experienceLevel} />

        <AnnotationSection>
          {doc.translatedSegments?.map((seg, i) => (
            <Segment
              key={`s${i}`}
              segment={seg.source as GatsbyTypes.Dailp_AnnotatedSeg}
              dialog={dialog}
              onOpenDetails={setMorpheme}
              level={experienceLevel.state! as ExperienceLevel}
              tagSet={tagSet}
              translations={
                seg.translation as GatsbyTypes.Dailp_TranslationBlock
              }
              pageImages={doc.pageImages}
            />
          ))}
          {doc.pageImages.map((url, i) => (
            <PageImage key={i} src={url} />
          ))}
        </AnnotationSection>
      </AnnotatedDocument>
    </Layout>
  )
}
export default AnnotatedDocumentPage

const PageImage = styled.img`
  margin-bottom: 2rem;
  width: 100%;
  height: auto;
`

export enum ExperienceLevel {
  Basic = 0,
  Learner = 1,
  Advanced = 2,
}

export enum TagSet {
  Dailp,
  Learner,
  Crg,
}

const ExperiencePicker = (p: { radio: RadioStateReturn }) => {
  return (
    <RadioGroup {...p.radio}>
      {Object.keys(ExperienceLevel)
        .filter((l) => isNaN(Number(l)))
        .map((level: string) => (
          <label key={level}>
            <Radio
              {...p.radio}
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
        pageImages
        translatedSegments {
          source {
            ... on Dailp_AnnotatedForm {
              ...FormFields
            }
            ... on Dailp_AnnotatedPhrase {
              ...BlockFields
            }
            ... on Dailp_PageBreak {
              index
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
      simpleMorpheme: morpheme(system: DT)
      gloss
      matchingTag {
        crg
        learner
      }
    }
    englishGloss
    commentary
  }
`

const MorphemeDialog = styled(Dialog)`
  ${largeDialog}
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border: 1px solid black;
  padding: 1rem;
  max-height: 80vh;
  min-height: 20rem;
  max-width: 100vw;
  overflow-y: scroll;
`

const MorphemeDialogBackdrop = styled(DialogBackdrop)`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.2);
`

const AnnotatedDocument = styled.main`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  font-size: 1rem;
`

const DocSection = styled.section`
  ${fullWidth}
`

export const AnnotationSection = styled(DocSection)`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
`
