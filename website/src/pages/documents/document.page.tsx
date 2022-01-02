import lazy from "@loadable/component"
import { ParsedUrlQuery } from "querystring"
import React, { useState } from "react"
import { isMobile } from "react-device-detect"
import Sticky from "react-stickynode"
import { Dialog, DialogBackdrop, useDialogState } from "reakit/Dialog"
import { Tab, TabList, TabPanel } from "reakit/Tab"
import { DocumentAudio } from "src/audio-player"
import { Breadcrumbs } from "src/breadcrumbs"
import { Button } from "src/components"
import * as Dailp from "src/graphql/dailp"
import Layout from "src/layout"
import Link from "src/link"
import { ExperiencePicker, selectedMode, selectedPhonetics } from "src/mode"
import { MorphemeDetails } from "src/morpheme"
import {
  collectionRoute,
  documentDetailsRoute,
  documentRoute,
} from "src/routes"
import { useScrollableTabState } from "src/scrollable-tabs"
import { AnnotatedForm, Segment } from "src/segment"
import {
  BasicMorphemeSegment,
  PhoneticRepresentation,
  ViewMode,
  tagSetForMode,
} from "src/types"
import * as css from "./document.css"

const PageImages = lazy(() => import("../../page-image"))

enum Tabs {
  ANNOTATION = "annotation-tab",
  IMAGES = "source-image-tab",
}

export type Document = Dailp.AnnotatedDocumentQuery["document"]

/** A full annotated document, including all metadata and the translation(s) */
const AnnotatedDocumentPage = (props) => {
  const [{ data }] = Dailp.useAnnotatedDocumentQuery({
    variables: { id: props.id, isReference: false },
  })
  const doc = data?.document
  if (!doc) {
    return null
  }
  return (
    <Layout title={doc?.title}>
      <main className={css.annotatedDocument}>
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

const TabSet = ({ doc }: { doc: Document }) => {
  const tabs = useScrollableTabState({ selectedId: Tabs.ANNOTATION })
  return (
    <>
      <WideSticky
        top={isMobile ? "#header" : undefined}
        className={css.wideAndTop}
      >
        <TabList
          {...tabs}
          id="document-tabs-header"
          className={css.docTabs}
          aria-label="Document View Types"
        >
          <Tab {...tabs} id={Tabs.ANNOTATION} className={css.docTab}>
            Translation
          </Tab>
          <Tab {...tabs} id={Tabs.IMAGES} className={css.docTab}>
            Original Text
          </Tab>
        </TabList>
      </WideSticky>

      <TabPanel
        {...tabs}
        className={css.docTabPanel}
        id={`${Tabs.ANNOTATION}-panel`}
        tabId={Tabs.ANNOTATION}
      >
        <TranslationTab doc={doc} />
      </TabPanel>

      <TabPanel
        {...tabs}
        className={css.imageTabPanel}
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
  <Sticky
    innerClass={css.solidSticky}
    top={props.top}
    className={props.className}
  >
    {props.children}
  </Sticky>
)

const WideSticky = (props: { top: string; children: any; className?: any }) => (
  <Sticky
    innerClass={css.wideSticky}
    top={props.top}
    className={props.className}
  >
    {props.children}
  </Sticky>
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
      <DialogBackdrop className={css.morphemeDialogBackdrop} {...dialog}>
        <Dialog
          {...dialog}
          className={css.morphemeDialog}
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

      <p className={css.paragraph}>
        Each mode below displays different information about the words on the
        page. Hover over each mode for a specific description.
      </p>

      <SolidSticky top="#document-tabs-header">
        <>
          <ExperiencePicker onSelect={setExperienceLevel} />
          {/*<PhoneticsPicker onSelect={setPhoneticRepresentation} />*/}
        </>
      </SolidSticky>

      <article className={css.annotationContents}>
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

export const DocumentTitleHeader = (p: {
  doc: Pick<Dailp.AnnotatedDoc, "slug" | "title"> & {
    date: Pick<Dailp.AnnotatedDoc["date"], "year">
    collection: Pick<Dailp.AnnotatedDoc["collection"], "name" | "slug">
    audioRecording?: Pick<Dailp.AnnotatedDoc["audioRecording"], "resourceUrl">
  }
  showDetails?: boolean
}) => (
  <header className={css.docHeader}>
    <Breadcrumbs aria-label="Breadcrumbs">
      <a href="/">Collections</a>
      {p.doc.collection && (
        <a href={collectionRoute(p.doc.collection.slug!)}>
          {p.doc.collection.name}
        </a>
      )}
    </Breadcrumbs>

    <h1 className={css.docTitle}>
      {p.doc.title}
      {p.doc.date && ` (${p.doc.date.year})`}{" "}
    </h1>
    <div className={css.bottomPadded}>
      {p.showDetails ? (
        <Link href={documentDetailsRoute(p.doc.slug!)}>View Details</Link>
      ) : (
        <Link href={documentRoute(p.doc.slug!)}>View Contents</Link>
      )}
      {!isMobile ? <Button onClick={() => window.print()}>Print</Button> : null}
    </div>
    {p.doc.audioRecording && ( // TODO Implement sticky audio bar
      <div id="document-audio-player" className={css.audioContainer}>
        <DocumentAudio audioUrl={p.doc.audioRecording.resourceUrl} />
      </div>
    )}
  </header>
)
