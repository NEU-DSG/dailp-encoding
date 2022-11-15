import { DialogContent, DialogOverlay } from "@reach/dialog"
import "@reach/dialog/styles.css"
import React, { useEffect, useState } from "react"
import { isMobile } from "react-device-detect"
import { Helmet } from "react-helmet"
import { MdSettings } from "react-icons/md"
import { Dialog, DialogBackdrop, useDialogState } from "reakit/Dialog"
import { Tab, TabList, TabPanel } from "reakit/Tab"
import { AudioPlayer, Breadcrumbs, Button, Link } from "src/components"
import { useMediaQuery } from "src/custom-hooks"
import { FormProvider, useForm } from "src/form-context"
import * as Dailp from "src/graphql/dailp"
import Layout from "src/layout"
import { drawerBg } from "src/menu.css"
import { MorphemeDetails } from "src/morpheme"
import { PanelDetails, PanelLayout, PanelSegment } from "src/panel-layout"
import { usePreferences } from "src/preferences-context"
import {
  collectionRoute,
  documentDetailsRoute,
  documentRoute,
} from "src/routes"
import { useScrollableTabState } from "src/scrollable-tabs"
import { AnnotatedForm, DocumentPage, TranslatedParagraph } from "src/segment"
import { mediaQueries } from "src/style/constants"
import { BasicMorphemeSegment, LevelOfDetail } from "src/types"
import PageImages from "../../page-image"
import * as css from "./document.css"

enum Tabs {
  ANNOTATION = "annotation-tab",
  IMAGES = "source-image-tab",
}

export type Document = NonNullable<Dailp.AnnotatedDocumentQuery["document"]>
export type DocumentContents = NonNullable<
  Dailp.DocumentContentsQuery["document"]
>

type NullPick<T, F extends keyof NonNullable<T>> = Pick<
  NonNullable<T>,
  F
> | null

/** A full annotated document, including all metadata and the translation(s) */
const AnnotatedDocumentPage = (props: { id: string }) => {
  const [{ data }] = Dailp.useAnnotatedDocumentQuery({
    variables: { slug: props.id },
  })
  const doc = data?.document
  if (!doc) {
    return null
  }
  return (
    <Layout>
      <Helmet title={doc?.title} />
      <main className={css.annotatedDocument}>
        <DocumentTitleHeader doc={doc} showDetails={true} />
        <TabSet doc={doc} />
      </main>
    </Layout>
  )
}
export default AnnotatedDocumentPage

const TabSet = ({ doc }: { doc: Document }) => {
  const tabs = useScrollableTabState({ selectedId: Tabs.ANNOTATION })
  return (
    <>
      <div className={css.wideAndTop}>
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
      </div>

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
        {doc.translatedPages ? (
          <PageImages
            pageImages={{
              urls:
                doc.translatedPages
                  ?.filter((p) => !!p.image)
                  .map((p) => p.image!.url) ?? [],
            }}
            document={doc}
          />
        ) : null}
      </TabPanel>
    </>
  )
}

const TranslationTab = ({ doc }: { doc: Document }) => {
  const [selectedMorpheme, setMorpheme] = useState<BasicMorphemeSegment | null>(
    null
  )

  const [dialogOpen, setDialogOpen] = useState(false)
  const closeDialog = () => setDialogOpen(false)
  const openDetails = (morpheme: BasicMorphemeSegment) => {
    setMorpheme(morpheme)
    setDialogOpen(true)
  }

  const dialog = useDialogState({ animated: true })

  const [selectedSegment, setSelectedSegment] = useState<PanelSegment | null>(
    null
  )

  const selectAndShowContent = (content: PanelSegment | null) => {
    setSelectedSegment(content)

    if (content) {
      dialog.show()
    } else {
      dialog.hide()
    }
  }

  // When the mobile version of the word panel is closed, remove any segment selection.
  useEffect(() => {
    if (!dialog.visible) {
      selectAndShowContent(null)
    }
  }, [dialog.visible])

  // This can now be either a word or paragraph.
  let panelInfo = {
    currContents: selectedSegment,
    setCurrContents: selectAndShowContent,
  }

  const { levelOfDetail, cherokeeRepresentation } = usePreferences()

  const isDesktop = useMediaQuery(mediaQueries.medium)

  return (
    <FormProvider>
      <DialogOverlay
        className={css.morphemeDialogBackdrop}
        isOpen={dialogOpen}
        onDismiss={closeDialog}
      >
        <DialogContent
          className={css.unpaddedMorphemeDialog}
          aria-label="Segment Details"
        >
          {selectedMorpheme ? (
            <MorphemeDetails
              documentId={doc.id}
              segment={selectedMorpheme}
              hideDialog={closeDialog}
              cherokeeRepresentation={cherokeeRepresentation}
            />
          ) : null}
        </DialogContent>
      </DialogOverlay>

      {!isDesktop && (
        <DialogBackdrop {...dialog} className={drawerBg}>
          <Dialog
            {...dialog}
            as="nav"
            className={css.mobileWordPanel}
            aria-label="Word Panel Drawer"
            preventBodyScroll={true}
          >
            <PanelLayout
              segment={panelInfo.currContents}
              setContent={panelInfo.setCurrContents}
            />
          </Dialog>
        </DialogBackdrop>
      )}

      <div className={css.contentContainer}>
        <article className={css.annotationContents}>
          <p className={css.topMargin}>
            Use the{" "}
            <span>
              <MdSettings size={32} style={{ verticalAlign: "middle" }} />{" "}
              Settings
            </span>{" "}
            button at the top of the page to change how documents are
            translated.
          </p>
          <DocumentContents
            {...{
              levelOfDetail,
              doc,
              openDetails,
              cherokeeRepresentation,
              wordPanelDetails: panelInfo,
            }}
          />
        </article>
        {selectedSegment && (
          <div className={css.contentSection2}>
            <PanelLayout
              segment={panelInfo.currContents}
              setContent={panelInfo.setCurrContents}
            />
          </div>
        )}
      </div>
    </FormProvider>
  )
}

const DocumentContents = ({
  levelOfDetail,
  doc,
  openDetails,
  cherokeeRepresentation,
  wordPanelDetails,
}: {
  doc: Document
  levelOfDetail: LevelOfDetail
  cherokeeRepresentation: Dailp.CherokeeOrthography
  openDetails: (morpheme: any) => void
  wordPanelDetails: PanelDetails
}) => {
  const [result, rerunQuery] = Dailp.useDocumentContentsQuery({
    variables: {
      slug: doc.slug,
      isReference: doc.isReference,
      morphemeSystem: cherokeeRepresentation,
    },
  })

  const docContents = result.data?.document
  const { form, isEditing } = useForm()

  useEffect(() => {
    // If the form has been submitted, update the panel's current contents to be the currently selected word
    if (form.submitting) {
      // Update the form's current word
      wordPanelDetails.setCurrContents(form.values.word)
      // Query of document contents is rerun to ensure frontend and backend are in sync
      rerunQuery({ requestPolicy: "network-only" })
    }
  }, [isEditing])

  if (!docContents) {
    return <>Loading...</>
  }

  return (
    <>
      {docContents.translatedPages?.map((seg, i) => (
        <DocumentPage
          key={i}
          segment={seg}
          onOpenDetails={openDetails}
          levelOfDetail={levelOfDetail}
          cherokeeRepresentation={cherokeeRepresentation}
          pageImages={
            doc.translatedPages
              ?.filter((p) => !!p.image)
              .map((p) => p.image!.url) ?? []
          }
          wordPanelDetails={wordPanelDetails}
        />
      ))}
      {docContents.forms?.map((form, i) => (
        <AnnotatedForm
          key={i}
          segment={form}
          onOpenDetails={openDetails}
          levelOfDetail={levelOfDetail}
          cherokeeRepresentation={cherokeeRepresentation}
          pageImages={[]}
          wordPanelDetails={wordPanelDetails}
        />
      ))}
    </>
  )
}

export const DocumentTitleHeader = (p: {
  doc: Pick<Dailp.AnnotatedDoc, "slug" | "title"> & {
    date: NullPick<Dailp.AnnotatedDoc["date"], "year">
    breadcrumbs: readonly Pick<
      Dailp.AnnotatedDoc["breadcrumbs"][0],
      "name" | "slug"
    >[]
    audioRecording?: NullPick<
      Dailp.AnnotatedDoc["audioRecording"],
      "resourceUrl"
    >
  }
  showDetails?: boolean
}) => (
  <header className={css.docHeader}>
    <Breadcrumbs aria-label="Breadcrumbs">
      <Link href="/">Collections</Link>
      {p.doc.breadcrumbs &&
        p.doc.breadcrumbs.map((crumb) => (
          <Link href={collectionRoute(crumb.slug)} key={crumb.slug}>
            {crumb.name}
          </Link>
        ))}
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
        <span>Document Audio:</span>
        <AudioPlayer
          style={{ flex: 1 }}
          audioUrl={p.doc.audioRecording.resourceUrl}
          showProgress
        />
      </div>
    )}
  </header>
)
