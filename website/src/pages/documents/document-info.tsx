import { DialogContent, DialogOverlay } from "@reach/dialog"
import "@reach/dialog/styles.css"
import React, { Fragment, useEffect, useState } from "react"
import { isMobile } from "react-device-detect"
import { Helmet } from "react-helmet"
import { MdSettings } from "react-icons/md/index"
import { RiArrowUpCircleFill } from "react-icons/ri/index"
import {
  Dialog,
  DialogBackdrop,
  unstable_Form as Form,
  Tab,
  TabList,
  TabPanel,
  useDialogState,
} from "reakit"
import { navigate } from "vite-plugin-ssr/client/router"
import { useCredentials } from "src/auth"
import { AudioPlayer, Breadcrumbs, Button, Link } from "src/components"
import { useMediaQuery } from "src/custom-hooks"
import { FormProvider, useForm } from "src/edit-doc-data-form-context"
import EditDocPanel, { EditButton } from "src/edit-doc-data-panel"
import * as Dailp from "src/graphql/dailp"
import Layout from "src/layout"
import { drawerBg } from "src/menu.css"
import { MorphemeDetails } from "src/morpheme"
import { PanelDetails, PanelLayout, PanelSegment } from "src/panel-layout"
import { usePreferences } from "src/preferences-context"
import { useLocation } from "src/renderer/PageShell"
import {
  chapterRoute,
  collectionWordPath,
  documentDetailsRoute,
  documentRoute,
} from "src/routes"
import { useScrollableTabState } from "src/scrollable-tabs"
import { AnnotatedForm, DocumentPage } from "src/segment"
import { mediaQueries } from "src/style/constants"
import { fullWidth } from "src/style/utils.css"
import { BasicMorphemeSegment, LevelOfDetail } from "src/types"
import PageImages from "../../page-image"
import * as css from "./document.css"

enum TabType {
  InfoTab,
  EditInfoTab,
}

export type TabSegment = Dailp.DocumentMetadataUpdate | Document

export type Document = NonNullable<Dailp.AnnotatedDocumentQuery["document"]>

export const DocumentInfo = ({ doc }: { doc: Document }) => {
  const [{ data }] = Dailp.useDocumentDetailsQuery({
    variables: { slug: doc.slug! },
  })
  const docData: Dailp.AnnotatedDoc = data?.document as Dailp.AnnotatedDoc
  if (!docData) {
    return null
  }
  const token = useCredentials()
  const { form, isEditing } = useForm()
  // const [showEditDialog, setShowEditDialog] = useState(false)
  // const handleButtonClick = () => setShowEditDialog(!showEditDialog)
  // let editButton = null
  // if (token) {
  //   editButton = <EditButton />
  // }

  const contributorsList = (
    <>
      <Helmet>
        <title>{docData.title} - Details</title>
      </Helmet>
      <section className={fullWidth}>
        <h3 className={css.topMargin}>Contributors</h3>
        <ul>
          {docData.contributors.map((person) => (
            <li key={person.name}>
              {person.name}: {person.role}
            </li>
          ))}
        </ul>
      </section>
    </>
  )

  const panel = (
    <>
      {/* If the user is logged in, then display an edit button on the word
  panel along with its corresponding formatted header. Otherwise, display
  the normal word panel. */}
      {token ? (
        <>
          {!isEditing && (
            <>
              {contributorsList}
            </>
          )}
          <EditButton />
        </>
      ) : (
        <>
          {contributorsList}
        </>
      )}
      {isEditing ? (
        <Form {...form}>
          <EditDocPanel
            document={docData}
            />
        </Form>
      ) : (<></>)}
    </>
  )
  // console.log(docData.id)
  return (
    <Fragment>
      <>{panel}</>

      {docData.sources.length > 0 ? (
        <section className={fullWidth}>
          Original document provided courtesy of{" "}
          <Link href={docData.sources[0]!.link}>
            {docData.sources[0]!.name}
          </Link>
          .
        </section>
      ) : null}
    </Fragment>
  )
}

const EditDocPanel2: React.FC = () => {
  return <div>Component Content</div>
}

// export const TabContent = (t: {
//   tab: TabType
//   doc: Dailp.DocumentMetadataUpdate
// }) => {
//   const TabComponent =
//     t.tab === TabType.EditInfoTab ? EditDocPanel : DocumentInfo

//     return(
//       TabComponent
//     )
// }
