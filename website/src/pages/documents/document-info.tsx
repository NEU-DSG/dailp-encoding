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
import { EditButton } from "src/edit-doc-data-panel"
import { FormProvider, useForm } from "src/edit-doc-data-form-context"
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

export type Document = NonNullable<Dailp.AnnotatedDocumentQuery["document"]>

export const DocumentInfo = ({ doc }: { doc: Document }) => {
  const [{ data }] = Dailp.useDocumentDetailsQuery({
    variables: { slug: doc.slug! },
  })
  const docData = data?.document
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

  const panel = <>
  {/* If the user is logged in, then display an edit button on the word
  panel along with its corresponding formatted header. Otherwise, display
  the normal word panel. */}
  {token ? (
    <>
      {!isEditing && (
        <div>have token</div>
      )}
      <EditButton />
      </>
  ) : (
    <>
      <div>no token</div>
    </>
  )}
    {isEditing ? (
      <Form {...form}>
        <div>EDITING!!!!</div>
      </Form>
  ) : (
    <div>not currently editing</div>
  )}
  </>




  return (
    <Fragment>
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

      <>{panel }</>

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

const EditDocPanel: React.FC = () => {
  return <div>Component Content</div>;
};