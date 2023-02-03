import React, { useEffect } from "react"
import { Helmet } from "react-helmet"
import { navigate } from "vite-plugin-ssr/client/router"
import { Link, WordpressPage } from "src/components"
import { useRouteParams } from "src/renderer/PageShell"
import * as util from "src/style/utils.css"
import CWKWLayout from "../cwkw/cwkw-layout"
import * as css from "../cwkw/cwkw-layout.css"
import { useChapters, useDialog } from "./edited-collection-context"

function redirectUrl(collectionSlug: string) {
  if (collectionSlug != "cwkw") {
    // Put here in case someone has one of these old collections bookmarked, but can remove if necessary
    switch (collectionSlug) {
      case "dollie-duncan-letters":
        navigate("/collections/cwkw/dollie_duncan")
        break
      case "echota-funeral-notices":
        navigate("/collections/cwkw/funeral_notices")
        break
      case "government documents":
        navigate("/collections/cwkw/governance_documents")
        break
      default:
        // TODO Don't go to a 404 page!!!!! first rule of 404s... jesus.
        navigate("/404")
    }
  }
}

// Renders an edited collection page based on the route parameters.
const EditedCollectionPage = () => {
  const { collectionSlug } = useRouteParams()
  const dialog = useDialog()

  const chapters = useChapters()

  const landingChapter = chapters ? chapters[0] : null
  const firstChapter = chapters ? chapters[1] : null

  useEffect(() => {
    redirectUrl(collectionSlug!)
  }, [collectionSlug])

  if (collectionSlug != "cwkw") {
    return null
  }

  return (
    <CWKWLayout>
      <Helmet>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <main className={util.paddedCenterColumn}>
        <article className={dialog.visible ? css.leftMargin : util.fullWidth}>
          <header>
            <h1>Cherokees Writing the Keetoowah Way</h1>
          </header>

          <h3>
            A digital collection presented by{" "}
            <Link href="https://dailp.northeastern.edu/">DAILP</Link>
          </h3>
          {landingChapter ? <WordpressPage slug={landingChapter.slug} /> : null}
          <h3>
            {firstChapter ? (
              <Link href={firstChapter.slug}>Begin reading</Link>
            ) : null}
          </h3>
        </article>
      </main>
    </CWKWLayout>
  )
}
export const Page = EditedCollectionPage
