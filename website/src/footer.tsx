import { wordpressUrl } from "src/theme.css"
import Link from "./components/link"
import * as css from "./footer.css"
import { usePageContext } from "./renderer/PageShell"

const Footer = () => {
  const { buildDate } = usePageContext()
  const currentYear = new Date().getFullYear()

  return (
    <footer className={css.footer}>
      {/* Main Footer section */}
      <div className={css.darkSection}>
        <div className={css.darkContainer}>
          <div className={css.footerGrid}>
            {/* Northeastern */}
            <div className={css.northeasternColumn}>
              <div>
                <img
                  src="https://masspromise.northeastern.edu/files/2023/06/Monogram-Wordmark_KO.png"
                  alt="Northeastern University Logo"
                  className={css.neuLogo}
                />
              </div>

              {/* Tools */}
              <div className={css.footerColumn}>
                <h4 className={css.sectionTitle}>Tools</h4>
                <nav className={css.toolsNav}>
                  <Link href="/glossary" className={css.toolsLink}>
                    Glossary of Terms
                  </Link>
                  <Link href="/search" className={css.toolsLink}>
                    Word Search
                  </Link>
                  <Link
                    href="https://github.com/neu-dsg/dailp-encoding"
                    className={css.toolsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Source Code
                  </Link>
                  <Link
                    href="https://github.com/NEU-DSG/dailp-encoding/wiki/User-Workflows"
                    className={css.toolsLink}
                  >
                    User Tutorials
                  </Link>
                  <Link href="/support" className={css.toolsLink}>
                    Support
                  </Link>
                </nav>
              </div>

              <p className={css.lastUpdated}>
                Last Updated on {buildDate.toDateString()}
              </p>
            </div>

            {/* About */}
            <div className={`${css.footerColumn} ${css.aboutSection}`}>
              <h4 className={css.sectionTitle}>About</h4>
              <p className={css.aboutText}>
                The Digital Archive of Indigenous Language Persistence (DAILP)
                is licensed under{" "}
                <Link
                  href="https://creativecommons.org/licenses/by-nc/4.0/?ref=chooser-v1"
                  className={css.aboutLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  CC BY-NC 4.0
                </Link>
                . Phase III is by{" "}
                <Link
                  href="https://www.ellencushman.com/"
                  className={css.aboutLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ellen Cushman
                </Link>
                , Naomi Trevino, Cara Hullings,{" "}
                <Link
                  href="http://www.linkedin.com/in/haileypunis/"
                  className={css.aboutLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Hailey Punis
                </Link>
                , Nop Lertsumitkul, Jae Messersmith,{" "}
                <Link
                  href="https://denniswang-20.vercel.app/"
                  className={css.aboutLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Dennis Wang
                </Link>
                ,{" "}
                <Link
                  href="https://alisonye.netlify.app/"
                  className={css.aboutLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Alison Ye
                </Link>
                , Molly Lane, Matthew Gentner,{" "}
                <Link
                  href="https://www.linkedin.com/in/nguyen-katie-neu/"
                  className={css.aboutLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Katie Nguyen
                </Link>
                , and{" "}
                <Link
                  href="http://sonandrea.live/"
                  className={css.aboutLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Andrea Son
                </Link>
                .
              </p>

              <p className={css.aboutText}>
                <br />
                DAILP was created with help from the{" "}
                <Link
                  href="https://dsg.northeastern.edu/"
                  className={css.aboutLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Digital Scholarship Group
                </Link>{" "}
                at the{" "}
                <Link
                  href="https://library.northeastern.edu/"
                  className={css.aboutLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Northeastern University Library
                </Link>
                .
              </p>
            </div>
          </div>

          {/* Bottom Row */}
          <div className={css.footerBottom}>
            This site is licensed under a Creative Commons Attribution
            NonCommercial 4.0 International license.
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
