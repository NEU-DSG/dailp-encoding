import "@fontsource/quattrocento-sans/latin.css"
import Cookies from "js-cookie"
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
import { HeaderPref } from "./mode"
import { hideOnPrint, themeClass } from "./sprinkles.css"
import { ViewMode } from "./types"
import "./wordpress.css"

/* const ClientSignIn = lazy(() => import("./client/signin")) */

// Set up experiencelevel
export const fetchSavedExperience = () =>
  Number.parseInt(Cookies.get("experienceLevel") ?? "0") as ViewMode
export const experienceContext = React.createContext({
  level: 0 as ViewMode,
  levelUpdate: (p: ViewMode) => {},
})

/** Wrapper for most site pages, providing them with a navigation header and footer. */
const Layout: React.FC = ({ children }) => {
  // Some experience level setup
  const [expLevel, expLevelUpdate] = useState(fetchSavedExperience())
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
          </div>
          <NavMenu />
          <experienceContext.Provider
            value={{ level: expLevel, levelUpdate: expLevelUpdate }}
          >
            {<HeaderPref />}
          </experienceContext.Provider>
        </header>
      </Sticky>

      <experienceContext.Provider
        value={{ level: expLevel, levelUpdate: expLevelUpdate }}
      >
        {children}
      </experienceContext.Provider>
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
