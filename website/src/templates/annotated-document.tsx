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
import { Tooltip, TooltipReference, useTooltipState } from "reakit/Tooltip"
import Sticky from "react-stickynode"
import Layout from "../layout"
import { Segment, AnnotatedForm } from "../segment"
import Cookies from "js-cookie"
import theme, { fullWidth, largeDialog, withBg } from "../theme"
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

  let tagSet = TagSet.Dailp
  if (experienceLevel.state! === ExperienceLevel.AdvancedTth) {
    tagSet = TagSet.Taoc
  } else if (experienceLevel.state! === ExperienceLevel.AdvancedDt) {
    tagSet = TagSet.Crg
  } else if (experienceLevel.state! === ExperienceLevel.Learner) {
    tagSet = TagSet.Learner
  }

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
                tagSet={tagSet}
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
          <PageImages pageImages={doc.pageImages} document={doc as any} />
        </TabPanel>
      </main>
    </Layout>
  )
}
export default AnnotatedDocumentPage

const annotationContents = css`
  width: 100%;
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
        <span className={notInPrint}>
          [<Link to={documentDetailsRoute(p.doc.slug!)}>Details</Link>]
        </span>
      ) : null}
    </h1>
  </header>
)

const notInPrint = css`
  ${theme.mediaQueries.print} {
    display: none;
  }
`

const wideAndTop = css`
  width: 100%;
  z-index: 1;
  ${theme.mediaQueries.print} {
    display: none;
    height: 0;
  }
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
  outline: none;
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

const notNumber = (l: any) => isNaN(Number(l))
const levelNameMapping = {
  [ExperienceLevel.Story]: {
    label: "Story",
    details: "Only the original syllabary text and free English translation",
  },
  [ExperienceLevel.Basic]: {
    label: "Study (basic)",
    details: "Original text with word by word translation",
  },
  [ExperienceLevel.Learner]: {
    label: "Study (detailed)",
    details:
      "Original text with a translation and breakdown of each word into its component parts",
  },
  [ExperienceLevel.AdvancedDt]: {
    label: "Analysis (CRG)",
    details:
      "Linguistic anaylsis using the Cherokee Reference Grammar (CRG) representation",
  },
  [ExperienceLevel.AdvancedTth]: {
    label: "Analysis (TAOC)",
    details:
      "Linguistic analysis using the Tone and Accent in Oklahoma Cherokee (TAOC) representation",
  },
}

const ExperiencePicker = (p: { radio: RadioStateReturn }) => {
  return (
    <RadioGroup {...p.radio} className={levelGroup}>
      {Object.keys(ExperienceLevel)
        .filter(notNumber)
        .map(function (level: string) {
          return <ExperienceOption key={level} level={level} radio={p.radio} />
        })}
    </RadioGroup>
  )
}

const ExperienceOption = (p: { radio: RadioStateReturn; level: string }) => {
  const tooltip = useTooltipState()
  const value = ExperienceLevel[p.level as keyof typeof ExperienceLevel]
  return (
    <>
      <TooltipReference {...tooltip} as="label" className={levelLabel}>
        <Radio {...p.radio} value={value} />
        {"  "}
        {levelNameMapping[value].label}
      </TooltipReference>
      <Tooltip {...tooltip} className={withBg}>
        {levelNameMapping[value].details}
      </Tooltip>
    </>
  )
}

const levelGroup = css`
  margin-top: ${theme.rhythm / 2}rem;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  ${theme.mediaQueries.print} {
    display: none;
  }
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
        sources {
          name
          link
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
      shapeTth: morpheme(system: TAOC)
      shapeDt: morpheme(system: CRG)
      shapeDtSimple: morpheme(system: LEARNER)
      gloss
      matchingTag {
        id
        taoc {
          tag
          title
        }
        learner {
          tag
          title
        }
        crg {
          tag
          title
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
  align-items: center;
  ${theme.mediaQueries.medium} {
    padding-left: ${theme.edgeSpacing};
    padding-right: ${theme.edgeSpacing};
  }
`
