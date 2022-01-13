import React from "react"
import { wordpressUrl } from "src/theme"
import * as css from "./footer.css"
import { usePageContext } from "./renderer/PageShell"

/** University affiliation, related navigation links, and contact info.  */
const Footer = () => {
  const { buildDate } = usePageContext()
  return (
    <footer className={css.darkTheme}>
      <div className={css.light}>
        <div className={css.content} style={{ display: "block" }}>
          This project was created using{" "}
          <a href="https://gatsbyjs.com">Gatsby</a> with help from the{" "}
          <a href="http://dsg.northeastern.edu/">Digital Scholarship Group</a>{" "}
          at the{" "}
          <a href="http://library.northeastern.edu/">
            Northeastern University Library
          </a>
        </div>
      </div>
      <div className={css.container}>
        <div className={css.content}>
          <a href="https://northeastern.edu">
            <img
              className={css.image}
              src={`${wordpressUrl}/wp-content/themes/quest-child/images/nu-light.svg`}
              alt="Northeastern University"
              width={180}
              loading="lazy"
            />
          </a>
          <a href="https://github.com/neu-dsg/dailp-encoding">
            Browse the source code
          </a>
        </div>
        <div className={css.content}>
          Last Updated on {buildDate.toDateString()}
        </div>
      </div>
    </footer>
  )
}
export default Footer
