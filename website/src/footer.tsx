import React from "react"
import { wordpressUrl } from "./theme"
import { FaGithub } from "react-icons/fa"
import * as css from "./footer.css"
import { hideOnPrint } from "./sprinkles.css"

/** University affiliation, related navigation links, and contact info.  */
const Footer = () => {
  return (
    <footer className={hideOnPrint}>
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
        <div className={css.content}>Last Updated on</div>
      </div>
    </footer>
  )
}
export default Footer
