import * as styles from "./wjs-homepage.css"

export const WJSQuickNav = () => {
  return (
    <div className={styles.quickNav}>
      <a href="#about" className={styles.navButtonStyle}>
        About
      </a>
      <a href="#getting-started" className={styles.navButtonStyle}>
        Getting Started
      </a>
      <a href="#chapters" className={styles.navButtonStyle}>
        Chapters
      </a>
      <a href="#featured-stories" className={styles.navButtonStyle}>
        Featured Stories
      </a>
      <a href="#credit" className={styles.navButtonStyle}>
        Credit & Reuse
      </a>
    </div>
  )
}

export default WJSQuickNav
