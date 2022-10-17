import "@fontsource/quattrocento-sans/latin.css"
import "normalize.css"
import React from "react"
import { Helmet } from "react-helmet"
import { Link } from "src/components"
import { useMediaQuery } from "src/custom-hooks"
import Footer from "src/footer"
import { mediaQueries } from "src/style/constants"
import "src/style/global.css"
import { HeaderPrefDrawer } from "../../mode"
import { PreferencesProvider } from "../../preferences-context"
import "../../wordpress.css"
import { MobileSidebar } from "../edited-collections/sidebar"
import * as css from "./cwkw-layout.css"
import { themeClass } from "./theme.css"

/** Wrapper for cwkw site pages, providing them with a navigation header and footer. */
const CWKWLayout: React.FC = ({ children }) => {
  const isDesktop = useMediaQuery(mediaQueries.large)

  return (
    <PreferencesProvider>
      <Helmet titleTemplate="%s - DAILP" defaultTitle="DAILP">
        <html lang="en" />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <body className={themeClass} />
      </Helmet>
      <header aria-label="Site Header" id="header" className={css.header}>
        <div className={css.headerContents}>
          {!isDesktop && <MobileSidebar />}
          <div className={css.contentContainer}>
            <h1 className={css.siteTitle}>
              <Link className={css.siteLink} href="/">
                DAILP
              </Link>
            </h1>
            <span className={css.subHeader}>
              Cherokees Writing the Keetoowah Way
            </span>
          </div>
          <HeaderPrefDrawer />
        </div>
      </header>
      {children}
      <Footer />
    </PreferencesProvider>
  )
}

export default CWKWLayout
