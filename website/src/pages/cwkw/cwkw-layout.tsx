import "@fontsource/quattrocento-sans/latin.css"
import "normalize.css"
import React from "react"
import { Helmet } from "react-helmet"
import { Link } from "src/components"
import { useMediaQuery } from "src/custom-hooks"
import { useRouteParams } from "src/renderer/PageShell"
import { colors, mediaQueries } from "src/style/constants"
import "src/style/global.css"
import { HeaderPrefDrawer } from "../../mode"
import { PreferencesProvider } from "../../preferences-context"
import "../../wordpress.css"
import { MobileSidebar } from "../edited-collections/sidebar"
import Sidebar from "../edited-collections/sidebar"
import * as css from "./cwkw-layout.css"
import { useDialog } from "./dialog-context"
import CWKWBanner from "./logo-no-background.svg"
import { themeClass } from "./theme.css"

/** Wrapper for cwkw site pages, providing them with a navigation header and footer. */
const CWKWLayout: React.FC = ({ children }) => {
  const isDesktop = useMediaQuery(mediaQueries.medium)
  const dialog = useDialog()

  const { collectionSlug } = useRouteParams()

  return (
    <PreferencesProvider>
      <Helmet titleTemplate="%s - DAILP" defaultTitle="DAILP">
        <html lang="en" />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <body className={themeClass} />
      </Helmet>

      <header
        aria-label="Site Header"
        id="header"
        className={dialog.visible ? css.openHeader : css.header}
      >
        <div
          className={
            dialog.visible ? css.openHeaderContents : css.headerContents
          }
        >
          {isDesktop ? <Sidebar /> : <MobileSidebar />}
          <div className={css.contentContainer}>
            <h1 className={css.siteTitle}>
              <Link className={css.siteLink} href={`/${collectionSlug}`}>
                <img
                  src={CWKWBanner}
                  alt="Red basket with the text CWKW Cherokees Writing the Keetoowah Way"
                  className={css.banner}
                />
              </Link>
            </h1>
          </div>
          <HeaderPrefDrawer color={colors.body} />
        </div>
      </header>
      {children}
    </PreferencesProvider>
  )
}

export default CWKWLayout
