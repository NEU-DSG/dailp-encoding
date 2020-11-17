import React, { useState, useEffect } from "react"
import { graphql, Link } from "gatsby"
import { styled } from "linaria/react"
import { useDialogState, Dialog, DialogBackdrop } from "reakit/Dialog"
import {
  Radio,
  RadioGroup,
  useRadioState,
  RadioStateReturn,
} from "reakit/Radio"
import { Tab, TabPanel, TabList } from "reakit/Tab"
import Sticky from "react-stickynode"
import Layout from "../layout"
import { AnnotationSection, Segment } from "../segment"
import Cookies from "js-cookie"
import theme, { fullWidth, largeDialog } from "../theme"
import { collectionRoute, documentDetailsRoute, documentRoute } from "../routes"
import { useScrollableTabState } from "../scrollable-tabs"
import { css } from "linaria"
import { DeepPartial } from "tsdef"
import { ExperienceLevel, TagSet, BasicMorphemeSegment } from "../types"
import { MorphemeDetails } from "../morpheme"
import PageImages from "../page-image"
import { Breadcrumbs } from "../breadcrumbs"
import { isMobile } from "react-device-detect"

enum Tabs {
  ANNOTATION = "annotation-tab",
  IMAGES = "source-image-tab",
}

/** A full annotated document, including all metadata and the translation(s) */
const AnnotatedDocumentPage = (p: {
  data: GatsbyTypes.AnnotatedDocumentQuery
}) => {
  const isSSR = typeof window === "undefined"
  const doc = p.data.dailp.document!
  const tabs = useScrollableTabState({ selectedId: Tabs.ANNOTATION })
  const dialog = useDialogState()
  const experienceLevel = useRadioState({
    state: Number.parseInt(Cookies.get("experienceLevel") ?? "0"),
  })
  const [selectedMorpheme, setMorpheme] = useState<BasicMorphemeSegment | null>(
    null
  )

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
      <main className={annotatedDocument}>
        <MorphemeDialogBackdrop {...dialog}>
          <MorphemeDialog {...dialog} aria-label="Segment Details">
            {selectedMorpheme ? (
              <MorphemeDetails
                documentId={doc.id}
                segment={selectedMorpheme}
                dialog={dialog}
              />
            ) : null}
          </MorphemeDialog>
        </MorphemeDialogBackdrop>

        <DocumentTitleHeader doc={doc as any} showDetails={true} />

        <WideSticky top={isMobile ? "#header" : undefined}>
          <DocTabs {...tabs} aria-label="Manuscript Tabs">
            <DocTab {...tabs} id={Tabs.ANNOTATION}>
              Translation
            </DocTab>
            <DocTab {...tabs} id={Tabs.IMAGES}>
              Source Image
            </DocTab>
          </DocTabs>
        </WideSticky>

        <TabPanel
          {...tabs}
          className={docTabPanel}
          id="id-1-3"
          tabId={Tabs.ANNOTATION}
        >
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

        <TabPanel
          {...tabs}
          className={imageTabPanel}
          id="id-1-4"
          tabId={Tabs.IMAGES}
        >
          <PageImages pageImages={doc.pageImages} />
        </TabPanel>
      </main>
    </Layout>
  )
}
export default AnnotatedDocumentPage

export const DocumentTitleHeader = (p: {
  doc: DeepPartial<GatsbyTypes.Dailp_AnnotatedDoc>
  showDetails?: boolean
}) => (
  <DocHeader>
    <Breadcrumbs aria-label="Breadcrumbs">
      <li>
        <Link to="/">Collections</Link>
      </li>
      {p.doc.collection && (
        <li>
          <Link to={collectionRoute(p.doc.collection.slug!)}>
            {p.doc.collection.name}
          </Link>
        </li>
      )}
    </Breadcrumbs>

    <h2>
      {p.showDetails ? (
        p.doc.title
      ) : (
        <Link to={documentRoute(p.doc.slug!)}>{p.doc.title}</Link>
      )}{" "}
      {p.doc.date && `(${p.doc.date.year})`}{" "}
      {p.showDetails ? (
        <>
          [<Link to={documentDetailsRoute(p.doc.slug!)}>Details</Link>]
        </>
      ) : null}
    </h2>
  </DocHeader>
)

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
  flex-grow: 1;
  cursor: pointer;
  font-family: ${theme.fonts.header};
  font-size: 1.1rem;
  background-color: ${theme.colors.header};
  color: ${theme.colors.headings};
  outline-color: ${theme.colors.headings};
  &[aria-selected="true"] {
    border-bottom: 2px solid ${theme.colors.headings};
  }
`

const DocTabs = styled(TabList)`
  display: flex;
  flex-flow: row nowrap;
  height: 2.6rem;
  ${fullWidth}
`

const docTabPanel = css`
  ${fullWidth}
  padding: 0 0.5rem;
  ${theme.mediaQueries.medium} {
    padding: 0 ${theme.edgeSpacing};
  }
`

const imageTabPanel = css`
  ${fullWidth}
`

const DocHeader = styled.header`
  ${fullWidth}
  padding: 0 ${theme.edgeSpacing};
`

const thingIsNaN = (l: any) => isNaN(Number(l))

const ExperiencePicker = (p: { radio: RadioStateReturn }) => {
  return (
    <RadioGroup {...p.radio}>
      {Object.keys(ExperienceLevel)
        .filter(thingIsNaN)
        .map(function (level: string) {
          return (
            <label key={level}>
              <Radio
                {...p.radio}
                value={ExperienceLevel[level as keyof typeof ExperienceLevel]}
              />
              {level}
            </label>
          )
        })}
    </RadioGroup>
  )
}

export const query = graphql`
  query AnnotatedDocument($id: String!, $isReference: Boolean!) {
    dailp {
      document(id: $id) {
        id
        title
        slug
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
            text
          }
        }
        forms {
          ...FormFields
        } @include(if: $isReference)
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

const annotatedDocument = css`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  font-size: 1rem;
`
