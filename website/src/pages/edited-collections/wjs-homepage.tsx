import { Link } from "src/components"
import Sidebar, { MobileSidebar } from "src/components/sidebar"
import { useMediaQuery } from "src/custom-hooks"
import { HeaderPrefDrawer } from "src/mode"
import { chapterRoute, collectionRoute } from "src/routes"
import { colors, mediaQueries } from "src/style/constants"
import { LoginHeaderButton } from "../auth/user-auth-layout"
import * as styles from "../cwkw/cwkw-layout.css"
import { useDialog } from "./edited-collection-context"
import * as css from "./wjs-homepage.css"
import WJSQuickNav from "./wjs-quick-nav"
import WJSTitleCard from "./wjs-title-card"

export const WJSHomepage = (props: {
  collectionSlug: string
  firstChapterSlug?: string | null
}) => {
  const isDesktop = useMediaQuery(mediaQueries.medium)
  const dialog = useDialog()
  const { collectionSlug, firstChapterSlug } = props

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
                href={collectionRoute(collectionSlug)}
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
        button={
          firstChapterSlug
            ? {
                text: "Start Reading",
                link: chapterRoute(collectionSlug, firstChapterSlug),
              }
            : undefined
        }
      />
      <WJSQuickNav />

      <main className={css.contentColumn}>
        <section id="about" className={css.section}>
          <h2 className={css.sectionHeading}>About</h2>
        </section>
        <section id="getting-started" className={css.section}>
          <h2 className={css.sectionHeading}>Getting Started</h2>
        </section>
        <section id="chapters" className={css.section}>
          <h2 className={css.sectionHeading}>Chapters</h2>
        </section>
        <section id="featured-stories" className={css.section}>
          <h2 className={css.sectionHeading}>Featured Stories</h2>
        </section>
        <section id="credit" className={css.section}>
          <h2 className={css.sectionHeading}>Credit &amp; Reuse</h2>
        </section>
      </main>
    </div>
  )
}

export default WJSHomepage
