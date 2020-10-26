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
import { useTabState, Tab, TabPanel, TabList } from "reakit/Tab"
import Sticky from "react-stickynode"
import Layout from "../layout"
import { MorphemeDetails } from "../morpheme"
import { Segment, BasicMorphemeSegment } from "../segment"
import Cookies from "js-cookie"
import theme, { fullWidth, largeDialog } from "../theme"
import { collectionRoute } from "../routes"

interface TabScrollPositions {
  [x: string]: number
}

/** A full annotated document, including all metadata and the translation(s) */
const AnnotatedDocumentPage = (p: {
  data: GatsbyTypes.AnnotatedDocumentQuery
}) => {
  const doc = p.data.dailp.document!
  const dialog = useDialogState()
  const tabs = useTabState()
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

  const tabScrollPos = useRef<TabScrollPositions>({})
  useEffect(() => {
    // Restore the scroll position for the new tab.
    const newScroll = tabScrollPos.current[tabs.selectedId!]
    if (newScroll) {
      window.scrollTo({ top: newScroll })
    }

    const listener = (e: any) => {
      // Save scroll position for last tab.
      const lastTabId = tabs.selectedId!
      if (lastTabId) {
        tabScrollPos.current[lastTabId] = window.scrollY
      }
    }
    window.addEventListener("scroll", listener)

    return () => window.removeEventListener("scroll", listener)
  }, [tabs.selectedId])

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

        <DocHeader>
          <h2>
            {doc.title} {doc.date && `(${doc.date.year})`}
          </h2>
          <Link to={collectionRoute(doc.collection!)}>
            <h3>{doc.collection}</h3>
          </Link>
        </DocHeader>

        <WideSticky>
          <DocTabs {...tabs}>
            <Tab {...tabs}>Annotation</Tab>
            <Tab {...tabs}>Source Image</Tab>
          </DocTabs>
        </WideSticky>

        <TabPanel {...tabs}>
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
          </AnnotationSection>
        </TabPanel>

        <TabPanel {...tabs}>
          <AnnotationSection>
            {doc.pageImages.map((url, i) => (
              <PageImage key={i} src={url} />
            ))}
          </AnnotationSection>
        </TabPanel>
      </AnnotatedDocument>
    </Layout>
  )
}
export default AnnotatedDocumentPage

const WideSticky = styled(({ className, ...p }) => (
  <Sticky innerClass={className} {...p} />
))`
  left: 0;
`

const DocTabs = styled(TabList)`
  display: flex;
  flex-flow: row nowrap;
  width: 100vw;
  height: 48px;
  ${theme.mediaQueries.small} {
    width: 100%;
  }
  & > * {
    flex-grow: 1;
  }
`

export const DocHeader = styled.header`
  padding: 0 ${theme.edgeSpacing};
`

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
