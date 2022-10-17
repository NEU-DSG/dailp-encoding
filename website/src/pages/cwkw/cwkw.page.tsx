import { useState } from "react"
import { Helmet } from "react-helmet"
import { Link } from "src/components"
import { useMediaQuery } from "src/custom-hooks"
import { mediaQueries } from "src/style/constants"
import * as css from "../edited-collections/edited-collection.page.css"
import TOCSidebar from "../edited-collections/sidebar"
import CWKWLayout from "./cwkw-layout"

// Renders the homepage for CWKW.
const CWKWPage = () => {
  const isDesktop = useMediaQuery(mediaQueries.large)
  const [isOpen, setIsOpen] = useState(true)

  return (
    <CWKWLayout>
      <Helmet>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <main className={isDesktop ? css.rightColumn : css.centerColumn}>
        {isDesktop && <TOCSidebar isOpen={isOpen} setIsOpen={setIsOpen} />}
        <article
          className={
            // Shifts the center content towards the right to allow for room of the sidebar.
            isOpen && isDesktop ? css.partialWidth : css.paddedFullWidth
          }
        >
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

          <h3>
            <Link href="#">Begin reading</Link>
          </h3>
        </article>
        {/* Div here to keep center spacing of the middle. */}
        <div style={{ flex: 1 }} />
      </main>
    </CWKWLayout>
  )
}

export default CWKWPage
