import React, { useState } from "react"
import Link from "next/link"
import { useDialogState, Dialog, DialogBackdrop } from "reakit/Dialog"
import { Tab, TabPanel, TabList } from "reakit/Tab"
import Sticky from "react-stickynode"
import Layout from "src/layout"
import { Segment, AnnotatedForm } from "src/segment"
import theme, {
  largeDialog,
  withBg,
  std,
  hideOnPrint,
  typography,
  fullWidth,
  Button,
} from "src/theme"
import {
  collectionRoute,
  documentDetailsRoute,
  documentRoute,
} from "src/routes"
import { useScrollableTabState } from "src/scrollable-tabs"
import { css, ClassNames } from "@emotion/react"
import { DeepPartial } from "tsdef"
import {
  ViewMode,
  BasicMorphemeSegment,
  tagSetForMode,
  PhoneticRepresentation,
} from "src/types"
import { MorphemeDetails } from "src/morpheme"
import { Breadcrumbs } from "src/breadcrumbs"
import { isMobile } from "react-device-detect"
import {
  ExperiencePicker,
  selectedMode,
  selectedPhonetics,
  PhoneticsPicker,
} from "src/mode"
import { DocumentAudio } from "src/audio-player"
import loadable from "next/dynamic"
import * as Dailp from "src/graphql/dailp"
import * as Wordpress from "src/graphql/wordpress"
import { client, getStaticQueriesNew } from "src/graphql"
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next"
import { ParsedUrlQuery } from "querystring"

const PageImages = loadable(() => import("src/page-image"))

enum Tabs {
  ANNOTATION = "annotation-tab",
  IMAGES = "source-image-tab",
}

export type Document = Dailp.AnnotatedDocumentQuery["document"]

/** A full annotated document, including all metadata and the translation(s) */
const AnnotatedDocumentPage = ({ id }) => {
  const [
    {
      data: { document: doc },
    },
  ] = Dailp.useAnnotatedDocumentQuery({
    variables: { id, isReference: false },
  })
  return (
    <Layout title={doc.title}>
      <main css={annotatedDocument}>
        <DocumentTitleHeader doc={doc} showDetails={true} />
        <TabSet doc={doc} />
      </main>
    </Layout>
  )
}
export default AnnotatedDocumentPage

interface Params extends ParsedUrlQuery {
  id: string
}

export const getStaticProps = getStaticQueriesNew(async (params, dailp, wp) => {
  const id = params.id.toUpperCase()
  await wp.query(Wordpress.MainMenuDocument).toPromise()
  const { data } = await dailp
    .query<Dailp.AnnotatedDocumentQuery, Dailp.AnnotatedDocumentQueryVariables>(
      Dailp.AnnotatedDocumentDocument,
      { id, isReference: false }
    )
    .toPromise()
  return { id, doc: data?.document }
})

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await client.dailp
    .query<Dailp.DocumentsPagesQuery, Dailp.DocumentsPagesQueryVariables>(
      Dailp.DocumentsPagesDocument
    )
    .toPromise()

  return {
    paths: data.allDocuments.map((document) => ({
      params: { id: document.id.toLowerCase() },
    })),
    fallback: false,
  }
}

const TabSet = ({ doc }: { doc: Document }) => {
  const tabs = useScrollableTabState({ selectedId: Tabs.ANNOTATION })
  return (
    <>
      <WideSticky top={isMobile ? "#header" : undefined} css={wideAndTop}>
        <TabList
          {...tabs}
          id="document-tabs-header"
          css={docTabs}
          aria-label="Document View Types"
        >
          <Tab {...tabs} id={Tabs.ANNOTATION} css={docTab}>
            Translation
          </Tab>
          <Tab {...tabs} id={Tabs.IMAGES} css={docTab}>
            Original Text
          </Tab>
        </TabList>
      </WideSticky>

      <TabPanel
        {...tabs}
        css={docTabPanel}
        id={`${Tabs.ANNOTATION}-panel`}
        tabId={Tabs.ANNOTATION}
      >
        <TranslationTab doc={doc} />
      </TabPanel>

      <TabPanel
        {...tabs}
        css={imageTabPanel}
        id={`${Tabs.IMAGES}-panel`}
        tabId={Tabs.IMAGES}
      >
        {doc.pageImages ? (
          <PageImages pageImages={doc.pageImages} document={doc} />
        ) : null}
      </TabPanel>
    </>
  )
}

const SolidSticky = (props: {
  top: string
  children: any
  className?: any
}) => (
  <ClassNames>
    {({ css }) => (
      <Sticky
        innerClass={css`
          background-color: ${theme.colors.body};
          z-index: 1;
        `}
        top={props.top}
        className={props.className}
      >
        {props.children}
      </Sticky>
    )}
  </ClassNames>
)

const WideSticky = (props: { top: string; children: any; className?: any }) => (
  <ClassNames>
    {({ css }) => (
      <Sticky
        innerClass={css`
          left: 0;
          display: flex;
          flex-flow: column nowrap;
          align-items: center;
          width: 100% !important;
          z-index: 1;
        `}
        top={props.top}
        className={props.className}
      >
        {props.children}
      </Sticky>
    )}
  </ClassNames>
)

const TranslationTab = ({ doc }) => {
  const dialog = useDialogState()
  const [selectedMorpheme, setMorpheme] = useState<BasicMorphemeSegment | null>(
    null
  )

  const [phoneticRepresentation, setPhoneticRepresentation] =
    useState<PhoneticRepresentation>(selectedPhonetics())

  const [experienceLevel, setExperienceLevel] = useState<ViewMode>(
    selectedMode()
  )

  const tagSet = tagSetForMode(experienceLevel)
  return (
    <>
      <DialogBackdrop css={morphemeDialogBackdrop} {...dialog}>
        <Dialog {...dialog} css={morphemeDialog} aria-label="Segment Details">
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

      <p css={[topMargin, hideOnPrint]}>
        Each mode below displays different information about the words on the
        page. Hover over each mode for a specific description.
      </p>

      <SolidSticky top="#document-tabs-header">
        <>
          <ExperiencePicker onSelect={setExperienceLevel} />
          {/*<PhoneticsPicker onSelect={setPhoneticRepresentation} />*/}
        </>
      </SolidSticky>

      <article css={annotationContents}>
        {doc.translatedSegments?.map((seg, i) => (
          <Segment
            key={i}
            segment={seg.source}
            dialog={dialog}
            onOpenDetails={setMorpheme}
            viewMode={experienceLevel}
            tagSet={tagSet}
            translations={seg.translation as Dailp.TranslationBlock}
            pageImages={doc.pageImages}
            phoneticRepresentation={phoneticRepresentation}
          />
        ))}
        {doc.forms?.map((form, i) => (
          <AnnotatedForm
            key={i}
            segment={form}
            dialog={dialog}
            onOpenDetails={setMorpheme}
            viewMode={experienceLevel}
            tagSet={tagSet}
            phoneticRepresentation={phoneticRepresentation}
            translations={null}
            pageImages={doc.pageImages}
          />
        ))}
      </article>
    </>
  )
}

const annotationContents = css`
  width: 100%;
`

const topMargin = css`
  margin-top: ${typography.rhythm(1 / 2)};
`

export const DocumentTitleHeader = (p: {
  doc: Pick<Dailp.AnnotatedDoc, "slug" | "title"> & {
    date: Pick<Dailp.AnnotatedDoc["date"], "year">
    collection: Pick<Dailp.AnnotatedDoc["collection"], "name" | "slug">
    audioRecording?: Pick<Dailp.AnnotatedDoc["audioRecording"], "resourceUrl">
  }
  showDetails?: boolean
}) => (
  <header css={docHeader}>
    <Breadcrumbs aria-label="Breadcrumbs">
      <li>
        <Link href="/">Collections</Link>
      </li>
      {p.doc.collection && (
        <li>
          <Link href={collectionRoute(p.doc.collection.slug!)}>
            {p.doc.collection.name}
          </Link>
        </li>
      )}
    </Breadcrumbs>

    <h1 css={docTitle}>
      {p.doc.title}
      {p.doc.date && ` (${p.doc.date.year})`}{" "}
    </h1>
    <div css={bottomPadded}>
      {p.showDetails ? (
        <Link href={documentDetailsRoute(p.doc.slug!)}>View Details</Link>
      ) : (
        <Link href={documentRoute(p.doc.slug!)}>View Contents</Link>
      )}
      {!isMobile ? <Button onClick={() => window.print()}>Print</Button> : null}
    </div>
    {p.doc.audioRecording && ( // TODO Implement sticky audio bar
      <div
        id="document-audio-player"
        css={wideAndTop && topMargin && bottomPadded}
      >
        <DocumentAudio audioUrl={p.doc.audioRecording.resourceUrl} />
      </div>
    )}
  </header>
)

const docTitle = css`
  running-head: chapter;
`

const bottomPadded = css`
  margin-bottom: ${typography.rhythm(1 / 2)};
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: space-between;
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

const docTab = css`
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

const docTabs = css`
  display: flex;
  flex-flow: row nowrap;
  height: ${typography.rhythm(1.75)};
  margin: 0 !important;
  ${fullWidth};
`

const docTabPanel = css`
  ${fullWidth};
  padding: 0 0.5rem;
  &:focus {
    outline: none;
  }
  ${theme.mediaQueries.medium} {
    padding: 0;
  }
`

const imageTabPanel = css`
  ${fullWidth};
  outline: none;
`

const docHeader = css`
  ${fullWidth};
  padding: 0 ${theme.edgeSpacing};
  ${theme.mediaQueries.medium} {
    padding: 0;
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
  max-width: 100vw;
  z-index: 999;
`

const morphemeDialogBackdrop = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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
