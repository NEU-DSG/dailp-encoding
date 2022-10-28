import "@fontsource/quattrocento-sans/latin.css"
import "normalize.css"
import React from "react"
import { Helmet } from "react-helmet"
import { Link } from "src/components"
import { useMediaQuery } from "src/custom-hooks"
import { HeaderPrefDrawer } from "src/mode"
import { PreferencesProvider } from "src/preferences-context"
import { useRouteParams } from "src/renderer/PageShell"
import { colors, mediaQueries } from "src/style/constants"
import "src/style/global.css"
import "../../wordpress.css"
import { useDialog } from "../edited-collections/edited-collection-context"
import { MobileSidebar } from "../edited-collections/sidebar"
import Sidebar from "../edited-collections/sidebar"
import CWKWBanner from "./cwkw-banner.svg"
import * as css from "./cwkw-layout.css"
import MobileCWKWBanner from "./mobile-cwkw-banner.svg"
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
        className={dialog.visible && isDesktop ? css.openHeader : css.header}
      >
        <div
          className={
            dialog.visible && isDesktop
              ? css.openHeaderContents
              : css.headerContents
          }
        >
          {isDesktop ? <Sidebar /> : <MobileSidebar />}
          <div className={css.contentContainer}>
            <h1 className={css.siteTitle}>
              <Link className={css.siteLink} href={`/${collectionSlug}`}>
                <img
                  src={isDesktop ? CWKWBanner : MobileCWKWBanner}
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
