import React from "react"
import { CreativeCommonsBy } from "src/components/attributions/creative-commons"
import { usePageContext } from "src/renderer/PageShell"
import { wordpressUrl } from "src/theme.css"
import { Link } from "src/ui"
import * as css from "./footer.css"

/** University affiliation, related navigation links, and contact info.  */
const Footer = () => {
  const { buildDate } = usePageContext()
  return (
    <footer className={css.footer}>
      <div className={css.dark}>
        <span className={css.content} style={{ display: "block" }}>
          <CreativeCommonsBy
            title="The Digital Archive of Indigenous Language Persistence (DAILP)"
            authors={[
              { name: "Ellen Cushman", link: "https://www.ellencushman.com" },
              { name: "Shelby Snead", link: "https://snead.xyz" },
              { name: "Naomi Trevino" },
              { name: "Jeffrey Bourns" },
              { name: "Aparna Dutta" },
              { name: "Henry Volchonok" },
            ]}
          />
        </span>
        <p className={css.content} style={{ display: "block" }}>
          This project was created with help from the{" "}
          <Link href="http://dsg.northeastern.edu/">
            Digital Scholarship Group
          </Link>{" "}
          at the{" "}
          <Link href="http://library.northeastern.edu/">
            Northeastern University Library
          </Link>
        </p>
        <div className={css.content}>
          <Link href="https://northeastern.edu">
            <img
              className={css.image}
              src={`${wordpressUrl}/wp-content/themes/quest-child/images/nu-light.svg`}
              alt="Northeastern University"
              width={180}
              loading="lazy"
            />
          </Link>
          <Link href="https://github.com/neu-dsg/dailp-encoding">
            Browse the source code
          </Link>
        </div>
        <div className={css.content}>
          Last Updated on {buildDate.toDateString()}
        </div>
      </div>
      <div className={css.light}>
        <h4>
          <Link href="/support">Supported by</Link>
        </h4>
        <div className={css.content}>
          <Link href="https://www.hluce.org/">
            <img
              src={`${wordpressUrl}/wp-content/uploads/2021/04/LUCE-Logo-Full-Color-L-768x242.png`}
              height={68}
              alt="Henry Luce Foundation"
            />
          </Link>
          <Link href="https://www.archives.gov/nhprc">
            <img
              src={`${wordpressUrl}/wp-content/uploads/2021/12/nhprc-logo-239x300.jpg`}
              width={120}
              alt="National Archives: National Historical Publications & Records Commission"
            />
          </Link>
          <Link href="https://www.neh.gov/">
            <img
              src={`${wordpressUrl}/wp-content/uploads/2021/12/NEH-Preferred-Seal820-768x348.jpg`}
              width={150}
              alt="National Endowment for the Humanities"
            />
          </Link>
          <Link href="https://librarynews.northeastern.edu/?p=275791">
            <img
              src={`${wordpressUrl}/wp-content/uploads/2022/03/SHARP-website-v01-300x200.jpg`}
              width={150}
              alt="Sustaining the Humanities through the American Rescue Plan Grant"
            />
          </Link>
          <Link href="https://www.imls.gov/">
            <img
              src={`${wordpressUrl}/wp-content/uploads/2021/09/imls_logo_2c-300x136.jpg`}
              width={150}
              alt="Institute of Museum and Library Services"
            />
          </Link>
        </div>
      </div>
    </footer>
  )
}
export default Footer
