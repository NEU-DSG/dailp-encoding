import React, { useState, useEffect } from "react"
import { graphql, Link } from "gatsby"
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
import { Segment, AnnotatedForm } from "../segment"
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
      ? TagSet.Taoc
      : TagSet.Learner

  return (
    <Layout title={doc.title}>
      <main className={annotatedDocument}>
        <DialogBackdrop className={morphemeDialogBackdrop} {...dialog}>
          <Dialog
            {...dialog}
            className={morphemeDialog}
            aria-label="Segment Details"
          >
            {selectedMorpheme ? (
              <MorphemeDetails
                documentId={doc.id}
                segment={selectedMorpheme}
                dialog={dialog}
              />
            ) : null}
          </Dialog>
        </DialogBackdrop>

        <DocumentTitleHeader doc={doc as any} showDetails={true} />
        <Sticky
          top={isMobile ? "#header" : undefined}
          className={wideAndTop}
          innerClass={wideSticky}
        >
          <TabList {...tabs} className={docTabs} aria-label="Manuscript Tabs">
            <Tab {...tabs} id={Tabs.ANNOTATION} className={docTab}>
              Text
            </Tab>
            <Tab {...tabs} id={Tabs.IMAGES} className={docTab}>
              Source Image
            </Tab>
          </TabList>
        </Sticky>

        <TabPanel
          {...tabs}
          className={docTabPanel}
          id="id-1-3"
          tabId={Tabs.ANNOTATION}
        >
          <ExperiencePicker radio={experienceLevel} />

          <article className={annotationContents}>
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
            {doc.forms?.map((form, i) => (
              <AnnotatedForm
                key={i}
                segment={form}
                dialog={dialog}
                onOpenDetails={setMorpheme}
                level={experienceLevel.state! as ExperienceLevel}
                tagSet={tagSet}
                translations={null}
                pageImages={doc.pageImages}
              />
            ))}
          </article>
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

const annotationContents = css`
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
`

export const DocumentTitleHeader = (p: {
  doc: DeepPartial<GatsbyTypes.Dailp_AnnotatedDoc>
  showDetails?: boolean
}) => (
  <header className={docHeader}>
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

    <h1>
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
    </h1>
  </header>
)

const wideAndTop = css`
  width: 100%;
  z-index: 1;
`

const wideSticky = css`
  left: 0;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  width: 100% !important;
`

const docTab = css`
  border-radius: 0;
  border: none;
  flex-grow: 1;
  cursor: pointer;
  font-family: ${theme.fonts.header};
  font-size: 1.25rem;
  background-color: ${theme.colors.header};
  color: ${theme.colors.headings};
  outline-color: ${theme.colors.headings};
  &[aria-selected="true"] {
    border-bottom: 2px solid ${theme.colors.headings};
  }
`

const docTabs = css`
  display: flex;
  flex-flow: row nowrap;
  height: ${theme.rhythm * 2}rem;
  ${fullWidth}
`

const docTabPanel = css`
  ${fullWidth}
  padding: 0 0.5rem;
  ${theme.mediaQueries.medium} {
    padding: 0;
  }
`

const imageTabPanel = css`
  ${fullWidth}
`

const docHeader = css`
  ${fullWidth}
  padding: 0 ${theme.edgeSpacing};
  ${theme.mediaQueries.medium} {
    padding: 0;
  }
`

const thingIsNaN = (l: any) => isNaN(Number(l))

const ExperiencePicker = (p: { radio: RadioStateReturn }) => {
  return (
    <RadioGroup {...p.radio} className={levelGroup}>
      {Object.keys(ExperienceLevel)
        .filter(thingIsNaN)
        .map(function (level: string) {
          return (
            <label key={level} className={levelLabel}>
              <Radio
                {...p.radio}
                value={ExperienceLevel[level as keyof typeof ExperienceLevel]}
              />
              {"  "}
              {level}
            </label>
          )
        })}
    </RadioGroup>
  )
}

const levelGroup = css`
  margin-top: ${theme.rhythm / 2}rem;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
`

const levelLabel = css`
  margin-right: 2rem;
`

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
        translatedSegments @skip(if: $isReference) {
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
        forms @include(if: $isReference) {
          ...FormFields
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
      simpleMorpheme: morpheme(system: LEARNER)
      gloss
      matchingTag {
        id
        taoc {
          tag
          title
          definition
        }
        learner {
          tag
          title
          definition
        }
        crg {
          tag
          title
          definition
        }
      }
      nextSeparator
    }
    englishGloss
    commentary
  }
`

const morphemeDialog = css`
  ${largeDialog}
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border: 1px solid ${theme.colors.borders};
  border-radius: 2px;
  padding: ${theme.rhythm}rem 1rem;
  max-height: 80vh;
  min-height: 20rem;
  max-width: 100vw;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  z-index: 999;
`

const morphemeDialogBackdrop = css`
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
  ${theme.mediaQueries.medium} {
    padding-left: ${theme.edgeSpacing};
    padding-right: ${theme.edgeSpacing};
  }
`
