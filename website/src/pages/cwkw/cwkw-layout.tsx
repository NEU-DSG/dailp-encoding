import "@fontsource/quattrocento-sans/latin.css"
import "normalize.css"
import React from "react"
import { Helmet } from "react-helmet"
import { CreativeCommonsBy, Link } from "src/components"
import { MobileSidebar, Sidebar } from "src/components"
import { HeaderPrefDrawer } from "src/components/navigation/mode"
import { PreferencesProvider } from "src/contexts/preferences-context"
import { useMediaQuery } from "src/hooks/custom-hooks"
import { useRouteParams } from "src/renderer/PageShell"
import { collectionRoute } from "src/routes"
import { colors, mediaQueries } from "src/style/constants"
import "src/style/global.css"
import { LoginHeaderButton } from "../auth/user-auth-layout"
import { useDialog } from "../edited-collections/edited-collection-context"
import CWKWBanner from "./assets/cwkw-banner.svg"
import MobileCWKWBanner from "./assets/mobile-cwkw-banner.svg"
import * as css from "./cwkw-layout.css"
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
              <Link
                className={css.siteLink}
                href={collectionRoute(collectionSlug!)}
              >
                <img
                  src={isDesktop ? CWKWBanner : MobileCWKWBanner}
                  alt="Red basket with the text CWKW Cherokees Writing the Keetoowah Way"
                  className={css.banner}
                />
              </Link>
            </h1>
          </div>
          <LoginHeaderButton className={css.loginHeader} />
          <HeaderPrefDrawer color={colors.body} />
        </div>
      </header>
      {children}
      <footer
        aria-label="Site Footer"
        className={dialog.visible && isDesktop ? css.openHeader : css.header}
        id="footer"
      >
        <div
          className={
            dialog.visible && isDesktop
              ? css.openHeaderContents
              : css.headerContents
          }
        >
          <div className={css.noticeText}>
            <CreativeCommonsBy
              title="Cherokees Writing the Keetoowah Way"
              authors={[
                {
                  name: "Ellen Cushman",
                  link: "https://www.ellencushman.com/",
                },
                {
                  name: "Ben Frey",
                  link: "https://americanstudies.unc.edu/ben-frey/",
                },
                {
                  name: "Rachel Jackson",
                  link: "https://www.ou.edu/cas/english/about/faculty/rachel-jackson",
                },
                { name: "Ernestine Berry" },
                { name: "Clara Proctor" },
                { name: "Naomi Trevino" },
                { name: "Jeffrey Bourns" },
                { name: "Oleta Pritchett" },
                { name: "Tyler Hodges" },
                { name: "John Chewey" },
                { name: "Shelby Snead", link: "https://snead.xyz" },
                { name: "Chan Mi Oh", link: "https://chanmioh.github.io" },
                { name: "Kush Patel" },
                { name: "Shashwat Patel" },
                { name: "Nop Lertsumitkul" },
                { name: "Henry Volchonok" },
                { name: "Hazelyn Aroian" },
                { name: "Victor Mendevil" },
              ]}
            />
          </div>
        </div>
      </footer>
    </PreferencesProvider>
  )
}

export default CWKWLayout
