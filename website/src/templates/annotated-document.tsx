import React, { useState, useEffect, useRef } from "react"
import { graphql, Link } from "gatsby"
import { styled } from "linaria/react"
import { Helmet } from "react-helmet"
import { useDialogState, Dialog, DialogBackdrop } from "reakit/Dialog"
import {
  Radio,
  RadioGroup,
  useRadioState,
  RadioStateReturn,
} from "reakit/Radio"
import { Tab, TabPanel, TabList } from "reakit/Tab"
import Sticky from "react-stickynode"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import Layout from "../layout"
import { MorphemeDetails } from "../morpheme"
import { Segment, BasicMorphemeSegment } from "../segment"
import Cookies from "js-cookie"
import theme, { fullWidth, largeDialog } from "../theme"
import { collectionRoute } from "../routes"
import { useScrollableTabState } from "../scrollable-tabs"
import { css } from "linaria"

/** A full annotated document, including all metadata and the translation(s) */
const AnnotatedDocumentPage = (p: {
  data: GatsbyTypes.AnnotatedDocumentQuery
}) => {
  const doc = p.data.dailp.document!
  const dialog = useDialogState()
  const tabs = useScrollableTabState()
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
    <Layout title={doc.title}>
      <AnnotatedDocument>
        <MorphemeDialogBackdrop {...dialog}>
          <MorphemeDialog {...dialog} aria-label="Segment Details">
            {selectedMorpheme ? (
              <MorphemeDetails segment={selectedMorpheme} dialog={dialog} />
            ) : null}
          </MorphemeDialog>
        </MorphemeDialogBackdrop>

        <DocHeader>
          <h2>
            {doc.title} {doc.date && `(${doc.date.year})`}
          </h2>
          {doc.collection && (
            <Link to={collectionRoute(doc.collection.slug)}>
              <h3>{doc.collection.name}</h3>
            </Link>
          )}
        </DocHeader>

        <WideSticky top="#header">
          <DocTabs {...tabs}>
            <DocTab {...tabs}>Translation</DocTab>
            <DocTab {...tabs}>Source Image</DocTab>
          </DocTabs>
        </WideSticky>

        <TabPanel {...tabs}>
          <ExperiencePicker radio={experienceLevel} />

          <AnnotationSection as="article">
            {doc.translatedSegments?.map((seg, i) => (
              <Segment
                key={i}
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
          </AnnotationSection>
        </TabPanel>

        <TabPanel {...tabs}>
          <AnnotationSection as="figure">
            {doc.pageImages?.map((url, i) => (
              <TransformWrapper key={i}>
                <TransformComponent>
                  <PageImage src={url} alt={`Manuscript Page ${i + 1}`} />
                </TransformComponent>
              </TransformWrapper>
            ))}
          </AnnotationSection>
        </TabPanel>
      </AnnotatedDocument>
    </Layout>
  )
}
export default AnnotatedDocumentPage

const wideAndTop = css`
  width: 100%;
  z-index: 1;
`

const WideSticky = styled(({ className, ...p }) => (
  <Sticky className={wideAndTop} innerClass={className} {...p} />
))`
  left: 0;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  width: 100% !important;
`

const DocTab = styled(Tab)`
  border-radius: 0;
  border: none;
  border-bottom: 2px solid transparent;
  flex-grow: 1;
  cursor: pointer;
  font-family: ${theme.fonts.header};
  font-size: 1.1rem;
  &[aria-selected="true"] {
    border-color: ${theme.colors.headings};
  }
`

const DocTabs = styled(TabList)`
  display: flex;
  flex-flow: row nowrap;
  height: 2.6rem;
  ${fullWidth}
`

export const DocHeader = styled.header`
  padding: 0 ${theme.edgeSpacing};
`

const PageImage = styled.img`
  margin-bottom: 2rem;
  width: 100%;
  height: auto;
  cursor: grab;
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
        collection {
          name
          slug
        }
        date {
          year
        }
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
      nextSeparator
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
  border: 1px solid ${theme.colors.borders};
  border-radius: 2px;
  padding: 1rem;
  max-height: 80vh;
  min-height: 20rem;
  max-width: 100vw;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  z-index: 999;
`

const MorphemeDialogBackdrop = styled(DialogBackdrop)`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 998;
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
  flex-flow: column nowrap;
  margin: 0;
  ${theme.mediaQueries.medium} {
    flex-flow: row wrap;
    justify-content: space-between;
  }
`
