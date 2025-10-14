import "@fontsource/charis-sil/400.css"
import "@fontsource/charis-sil/700.css"
import "@fontsource/quattrocento-sans/latin.css"
import "normalize.css"
import React from "react"
import { Helmet } from "react-helmet"
import "src/style/global.css"
import { themeClass } from "src/theme.css"
import Link from "src/ui/atoms/link/link"
import { HeaderPrefDrawer } from "src/ui/atoms/mode-toggle/mode-toggle"
import Footer from "src/ui/organisms/footer/footer"
import { MobileNav, NavMenu } from "src/ui/organisms/menu/menu"
import { LayoutClient } from "src/client/layout"
import { Environment, deploymentEnvironment } from "src/env"
import * as css from "./layout.css"
import { LoginHeaderButton } from "src/pages/auth/user-auth-layout"
import { PreferencesProvider } from "src/preferences-context"
import "src/wordpress.css"

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
          <NavMenu menuID={2} />
        </header>
        {children}
        <Footer />
      </LayoutClient>
    </PreferencesProvider>
  )
}

export default Layout
