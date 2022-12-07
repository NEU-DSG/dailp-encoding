import React, { useEffect } from "react"
import { Helmet } from "react-helmet"
import { navigate } from "vite-plugin-ssr/client/router"
import { Link } from "src/components"
import { useEditedCollectionQuery } from "src/graphql/dailp"
import { useRouteParams } from "src/renderer/PageShell"
import * as util from "src/style/utils.css"
import CWKWLayout from "../cwkw/cwkw-layout"
import * as css from "../cwkw/cwkw-layout.css"
import { useDialog } from "./edited-collection-context"

// Renders an edited collection page based on the route parameters.
const EditedCollectionPage = () => {
  const { collectionSlug } = useRouteParams()
  const dialog = useDialog()

  useEffect(() => {
    if (collectionSlug != "cwkw") {
      switch (collectionSlug) {
        case "dollie-duncan-letters":
          navigate(`/collections/cwkw/dollie_duncan`)
          break
        case "echota-funeral-notices":
          navigate(`/collections/cwkw/funeral_notices`)
          break
        case "government documents":
          navigate(`/collections/cwkw/governance_documents`)
          break
        default:
          navigate(`/404`)
      }
    }
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
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <h3>
            <Link href="#">Begin reading</Link>
          </h3>
        </article>
      </main>
    </CWKWLayout>
  )
}
export default EditedCollectionPage
