import { DialogContent, DialogOverlay } from "@reach/dialog"
import "@reach/dialog/styles.css"
import React, {
  useEffect,
  useState,
} from "react"
import { isMobile } from "react-device-detect"
import { Helmet } from "react-helmet"
import {
  Dialog,
  DialogBackdrop,
  useDialogState,
} from "reakit/Dialog"
import { Tab, TabList, TabPanel } from "reakit/Tab"
import { DocumentAudio } from "src/audio-player"
import { Breadcrumbs } from "src/breadcrumbs"
import { Button } from "src/components"
import Link from "src/components/link"
import * as Dailp from "src/graphql/dailp"
import Layout from "src/layout"
import { drawerBg } from "src/menu.css"
import { MorphemeDetails } from "src/morpheme"
import { usePreferences } from "src/preferences-context"
import {
  collectionRoute,
  documentDetailsRoute,
  documentRoute,
} from "src/routes"
import { useScrollableTabState } from "src/scrollable-tabs"
import { AnnotatedForm, DocumentPage, Segment } from "src/segment"
import {
  BasicMorphemeSegment,
  PhoneticRepresentation,
  TagSet,
  ViewMode,
  tagSetForMode,
} from "src/types"
import { WordPanel, WordPanelDetails } from "src/word-panel"
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
      <div
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
  const [selectedWord, setSelectedWord] =
    useState<Dailp.FormFieldsFragment | null>(null)
  const selectAndShowWord = (content: Dailp.FormFieldsFragment | null) => {
    setSelectedWord(content)
    if (content) {
      dialog.show()
    } else {
      dialog.hide()
    }
  }
  /* This useEffect makes that when the mobile version of the word panel is closed, the word is unselected*/
  useEffect(() => {
    if (!dialog.visible) {
      selectAndShowWord(null)
    }
  }, [dialog.visible])

  let wordPanelInfo = {
    currContents: selectedWord,
    setCurrContents: selectAndShowWord,
  }

  const { viewMode, phoneticRepresentation } = usePreferences()

  const tagSet = tagSetForMode(viewMode)

  return (
    <>
      <DialogOverlay
        className={css.morphemeDialogBackdrop}
        isOpen={dialogOpen}
        onDismiss={closeDialog}
      >
        <DialogContent
          className={css.morphemeDialog}
          aria-label="Segment Details"
        >
          {selectedMorpheme ? (
            <MorphemeDetails
              documentId={doc.id}
              segment={selectedMorpheme}
              hideDialog={closeDialog}
              tagSet={tagSet}
            />
          ) : null}
        </DialogContent>
      </DialogOverlay>

      <DialogBackdrop {...dialog} className={drawerBg}>
        <Dialog
          {...dialog}
          as="nav"
          className={css.mobileWordPanel}
          aria-label="Word Panel Drawer"
          preventBodyScroll={false}
          hideOnClickOutside={false}
        >
          <WordPanel
            segment={wordPanelInfo.currContents}
            setContent={wordPanelInfo.setCurrContents}
            viewMode={viewMode}
            onOpenDetails={openDetails}
            tagSet={tagSet}
          />
        </Dialog>
      </DialogBackdrop>

      <div className={css.contentContainer}>
        <article className={css.annotationContents}>
          <DocumentContents
            {...{
              experienceLevel: viewMode,
              doc,
              openDetails,
              tagSet,
              phoneticRepresentation,
              wordPanelDetails: wordPanelInfo,
            }}
          />
        </article>
        {selectedWord && viewMode > 0 ? (
          <div className={css.contentSection2}>
            <WordPanel
              segment={wordPanelInfo.currContents}
              setContent={wordPanelInfo.setCurrContents}
              viewMode={viewMode}
              onOpenDetails={openDetails}
              tagSet={tagSet}
            />
          </div>
        ) : null}
      </div>
    </>
  )
}

const DocumentContents = ({
  experienceLevel,
  doc,
  openDetails,
  tagSet,
  phoneticRepresentation,
  wordPanelDetails,
}: {
  doc: Document
  experienceLevel: ViewMode
  tagSet: TagSet
  openDetails: (morpheme: any) => void
  phoneticRepresentation: PhoneticRepresentation
  wordPanelDetails: WordPanelDetails
}) => {
  let morphemeSystem = Dailp.CherokeeOrthography.Learner
  if (experienceLevel === ViewMode.AnalysisDt) {
    morphemeSystem = Dailp.CherokeeOrthography.Crg
  } else if (experienceLevel === ViewMode.AnalysisTth) {
    morphemeSystem = Dailp.CherokeeOrthography.Taoc
  }

  const [{ data }] = Dailp.useDocumentContentsQuery({
    variables: { slug: doc.slug, isReference: doc.isReference, morphemeSystem },
  })
  const docContents = data?.document
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
          viewMode={experienceLevel}
          tagSet={tagSet}
          pageImages={
            doc.translatedPages
              ?.filter((p) => !!p.image)
              .map((p) => p.image!.url) ?? []
          }
          phoneticRepresentation={phoneticRepresentation}
          wordPanelDetails={wordPanelDetails}
        />
      ))}
      {docContents.forms?.map((form, i) => (
        <AnnotatedForm
          key={i}
          segment={form}
          onOpenDetails={openDetails}
          viewMode={experienceLevel}
          tagSet={tagSet}
          phoneticRepresentation={phoneticRepresentation}
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
          <Link href={collectionRoute(crumb.slug)}>{crumb.name}</Link>
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
        <DocumentAudio audioUrl={p.doc.audioRecording.resourceUrl} />
      </div>
    )}
  </header>
)
