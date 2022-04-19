import React from "react"
import { wordpressUrl } from "src/theme"
import * as css from "./footer.css"
import { usePageContext } from "./renderer/PageShell"

/** University affiliation, related navigation links, and contact info.  */
const Footer = () => {
  const { buildDate } = usePageContext()
  return (
    <footer className={css.darkTheme}>
      <div className={css.container}>
        <p className={css.content} style={{ display: "block" }}>
          This project was created with help from the{" "}
          <a href="http://dsg.northeastern.edu/">Digital Scholarship Group</a>{" "}
          at the{" "}
          <a href="http://library.northeastern.edu/">
            Northeastern University Library
          </a>
        </p>
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
      <div className={css.light}>
        <h4>Supported by</h4>
        <div className={css.content}>
          <a href="https://www.hluce.org/">
            <img
              src={`${wordpressUrl}/wp-content/uploads/2021/04/LUCE-Logo-Full-Color-L-768x242.png`}
              width={150}
              alt="Henry Luce Foundation"
            />
          </a>
          <a href="https://www.archives.gov/nhprc">
            <img
              src={`${wordpressUrl}/wp-content/uploads/2021/12/nhprc-logo-239x300.jpg`}
              width={150}
              alt="National Archives: National Historical Publications & Records Commission"
            />
          </a>
          <a href="https://www.neh.gov/">
            <img
              src={`${wordpressUrl}/wp-content/uploads/2021/12/NEH-Preferred-Seal820-768x348.jpg`}
              width={150}
              alt="National Endowment for the Humanities"
            />
          </a>
          <a href="https://librarynews.northeastern.edu/?p=275791">
            <img
              src={`${wordpressUrl}/wp-content/uploads/2022/03/SHARP-website-v01-300x200.jpg`}
              width={150}
              alt="Sustaining the Humanities through the American Rescue Plan Grant"
            />
          </a>
          <a href="https://www.imls.gov/">
            <img
              src={`${wordpressUrl}/wp-content/uploads/2021/09/imls_logo_2c-300x136.jpg`}
              width={150}
              alt="Institute of Museum and Library Services"
            />
          </a>
        </div>
      </div>
    </footer>
  )
}
export default Footer
