import "@fontsource/quattrocento-sans/latin.css"
import "normalize.css"
import React, { useEffect, useState } from "react"
import { isMobile } from "react-device-detect"
import { Helmet } from "react-helmet"
import Sticky from "react-stickynode"
import Link from "src/components/link"
import Footer from "./footer"
import "./global-styles.css"
import * as css from "./layout.css"
import { MobileNav, NavMenu } from "./menu"
import { HeaderPrefDrawer, selectedMode, selectedPhonetics } from "./mode"
import { hideOnPrint, themeClass } from "./sprinkles.css"
import { PhoneticRepresentation, ViewMode } from "./types"
import "./wordpress.css"

/* const ClientSignIn = lazy(() => import("./client/signin")) */

// Set up experiencelevel
export const preferencesContext = React.createContext({
  expLevel: 0 as ViewMode,
  expLevelUpdate: (p: ViewMode) => {},
  phonRep: 0 as PhoneticRepresentation,
  phonRepUpdate: (p: PhoneticRepresentation) => {},
})

/** Wrapper for most site pages, providing them with a navigation header and footer. */
const Layout: React.FC = ({ children }) => {
  // Some experience level setup
  const [expLevel, expLevelUpdate] = useState(selectedMode())
  const [phonRep, phonRepUpdate] = useState(selectedPhonetics())
  const prefPack = {
    expLevel: expLevel,
    expLevelUpdate: expLevelUpdate,
    phonRep: phonRep,
    phonRepUpdate: phonRepUpdate,
  }
  return (
    <>
      <Helmet titleTemplate="%s - DAILP" defaultTitle="DAILP">
        <html lang="en" />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <body className={themeClass} />
      </Helmet>
      <Sticky enabled={isMobile} innerZ={2} className={hideOnPrint}>
        <header aria-label="Site Header" id="header" className={css.header}>
          <div className={css.headerContents}>
            <MobileNav />
            <div className={css.contentContainer}>
              <h1 className={css.siteTitle}>
                <Link className={css.siteLink} href="/">
                  DAILP
                </Link>
              </h1>
              <span className={css.subHeader}>
                Digital Archive of American Indian Languages Preservation and
                Perseverance
              </span>
            </div>
            <preferencesContext.Provider value={prefPack}>
              {<HeaderPrefDrawer />}
            </preferencesContext.Provider>
          </div>
          <NavMenu />
        </header>
      </Sticky>

      <preferencesContext.Provider value={prefPack}>
        {children}
      </preferencesContext.Provider>
      <Footer />
    </>
  )
}

/* export const SignIn = () => {
 *   const hasMounted = useHasMounted()
 *   if (hasMounted && !isProductionDeployment()) {
 *     return <ClientSignIn />
 *   } else {
 *     return null
 *   }
 * } */

export default Layout
