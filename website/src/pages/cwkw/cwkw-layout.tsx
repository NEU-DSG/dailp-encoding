import "@fontsource/quattrocento-sans/latin.css"
import "normalize.css"
import React from "react"
import { Helmet } from "react-helmet"
import { MdMenu } from "react-icons/md"
import {
  Dialog,
  DialogBackdrop,
  DialogDisclosure,
  useDialogState,
} from "reakit/Dialog"
import { Link } from "src/components"
import Tox1 from "src/components/toc.page"
import { useMediaQuery } from "src/custom-hooks"
import Footer from "src/footer"
import { useRouteParams } from "src/renderer/PageShell"
import { mediaQueries } from "src/style/constants"
import "src/style/global.css"
import { HeaderPrefDrawer } from "../../mode"
import { PreferencesProvider } from "../../preferences-context"
import "../../wordpress.css"
import { ChaptersProvider } from "../documents/chapters-context"
import * as css from "./cwkw-layout.css"
import { themeClass } from "./theme.css"
import * as tocCss from "./toc-sidebar.css"

/** Wrapper for cwkw site pages, providing them with a navigation header and footer. */
const CWKWLayout: React.FC = ({ children }) => {
  const isDesktop = useMediaQuery(mediaQueries.large)
  const collectionSlug = "cwkw"

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
          {!isDesktop && <MobileTOC />}
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

const MobileTOC = () => {
  const dialog = useDialogState({ animated: true })

  return (
    <>
      <DialogBackdrop {...dialog} className={tocCss.tocDrawerBg}>
        <Dialog
          {...dialog}
          className={tocCss.tocDrawer}
          as="nav"
          aria-label="Table of Contents"
          preventBodyScroll={true}
        >
          <nav className={tocCss.sidebar}>
            <div className={tocCss.tocHeader}>
              <div>Table of Contents</div>
            </div>
            <Tox1 />
          </nav>
        </Dialog>
      </DialogBackdrop>
      <DialogDisclosure
        {...dialog}
        className={tocCss.tocNavButton}
        aria-label="Open Table of Contents Drawer"
      >
        <MdMenu size={32} />
      </DialogDisclosure>
    </>
  )
}

export default CWKWLayout
