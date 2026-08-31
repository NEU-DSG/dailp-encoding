import { Link } from "src/components"
import Sidebar, { MobileSidebar } from "src/components/sidebar"
import { useMediaQuery } from "src/custom-hooks"
import { HeaderPrefDrawer } from "src/mode"
import { useRouteParams } from "src/renderer/PageShell"
import { collectionRoute } from "src/routes"
import { colors, mediaQueries } from "src/style/constants"
import { LoginHeaderButton } from "../auth/user-auth-layout"
import * as styles from "../cwkw/cwkw-layout.css"
import { useDialog } from "./edited-collection-context"
import * as css from "./wjs-homepage.css"
import WJSQuickNav from "./wjs-quick-nav"
import WJSTitleCard from "./wjs-title-card"

export const WJSHomepage = () => {
  const isDesktop = useMediaQuery(mediaQueries.medium)
  const dialog = useDialog()
  const { collectionSlug } = useRouteParams()

  return (
    <div>
      <header
        aria-label="WJS Site Header"
        id="header"
        className={dialog.visible && isDesktop ? css.openHeader : styles.header}
      >
        <div
          className={
            dialog.visible && isDesktop
              ? styles.openHeaderContents
              : styles.headerContents
          }
        >
          {isDesktop ? <Sidebar /> : <MobileSidebar />}
          <div
            className={styles.contentContainer}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <h1 className={styles.siteTitle}>
              <Link
                className={styles.siteLink}
                href={collectionRoute(collectionSlug!)}
              >
                {/* Add logo */}
                WJS
              </Link>
            </h1>
          </div>
          <LoginHeaderButton className={styles.loginHeader} />
          <HeaderPrefDrawer color={colors.body} />
        </div>
      </header>

      <WJSTitleCard
        button={{
          text: "Start Reading",
          link: "/acknowledgements",
        }}
      />

      <WJSQuickNav />

      <section id="about">...</section>
      <section id="getting-started">...</section>
      <section id="chapters">...</section>
      <section id="featured-stories">...</section>
      <section id="credit">...</section>
    </div>
  )
}
