import "@fontsource/charis-sil/400.css"
import "@fontsource/charis-sil/700.css"
import "@fontsource/quattrocento-sans/latin.css"
import "normalize.css"
import React from "react"
import { Helmet } from "react-helmet"
import Link from "src/components/link"
import "src/style/global.css"
import { themeClass } from "src/theme.css"
import { LayoutClient } from "./client/layout"
import { Environment, deploymentEnvironment } from "./env"
import Footer from "./footer"
import * as css from "./layout.css"
import { MobileNav, NavMenu } from "./menu"
import { HeaderPrefDrawer } from "./mode"
import { LoginHeaderButton } from "./pages/auth/user-auth-layout"
import { PreferencesProvider } from "./preferences-context"
import "./wordpress.css"
import NavBar from "./components/nav-bar"

/* const ClientSignIn = lazy(() => import("./client/signin")) */

/** Wrapper for most site pages, providing them with a navigation header and footer. */
const Layout: React.FC = ({ children }) => {
  return (
    <PreferencesProvider>
      <Helmet titleTemplate="%s - DAILP" defaultTitle="DAILP">
        <html lang="en" />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <body className={themeClass} />
      </Helmet>
      <LayoutClient>
        <header aria-label="Site Header" id="header" className={css.header}>
          <div className={css.headerContents}>
            <MobileNav menuID={2} />
            <div className={css.contentContainer}>
              <h1 className={css.siteTitle}>
                <Link className={css.siteLink} href="/">
                  DAILP
                </Link>
              </h1>
              <span className={css.subHeader}>
                Digital Archive of Indigenous Language Persistence
              </span>
            </div>
            <LoginHeaderButton />
            <HeaderPrefDrawer />
          </div>
          {/* <NavMenu menuID={2} /> */}
          <NavBar />
        </header>
        {children}
        <Footer />
      </LayoutClient>
    </PreferencesProvider>
  )
}

export default Layout
