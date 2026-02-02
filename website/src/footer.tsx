import Link from "./components/link"
import { CreativeCommonsBy } from "src/components/attributions/creative-commons"
import { usePageContext } from "./renderer/PageShell"
import * as css from "./footer.css"

/** University affiliation, related navigation links, and contact info. */
const Footer = () => {
  const { buildDate } = usePageContext()
  const currentYear = new Date().getFullYear()

  return (
    <footer className={css.footer}>
      {/* Supported By */}
      <div className={css.sponsorSection}>
        <h2 className={css.supportedByTitle}>Supported By</h2>

        <div className={css.sponsorLogosContainer}>
          <Link
            href="https://www.hluce.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://www.hluce.org/content/uploads/2018/04/hlf_logo_fullcolor_wordmark_rgb.png"
              alt="Henry Luce Foundation"
              className={css.sponsorLogo}
            />
          </Link>

          <Link
            href="https://www.archives.gov/nhprc"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://www.archives.gov/files/nhprc/images/nhprc-logo.jpg"
              alt="National Archives: NHPRC"
              className={css.sponsorLogoTall}
            />
          </Link>

          <Link
            href="https://www.mellon.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Andrew_W._Mellon_Foundation_logo.svg/1200px-Andrew_W._Mellon_Foundation_logo.svg.png"
              alt="Mellon Foundation"
              className={css.sponsorLogo}
            />
          </Link>

          <Link
            href="https://librarynews.northeastern.edu/?p=275791"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://library.northeastern.edu/wp-content/uploads/2022/03/SHARP-website-v01-300x200.jpg"
              alt="SHARP Grant"
              className={css.sponsorLogoTall}
            />
          </Link>

          <Link
            href="https://www.neh.gov/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://www.neh.gov/sites/default/files/styles/medium_square/public/2019-08/NEH-Preferred-Seal820.jpg"
              alt="National Endowment for the Humanities"
              className={css.sponsorLogoTall}
            />
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className={css.darkSection}>
        <div className={css.darkContainer}>
          <div className={css.footerGrid}>

            {/* University + Sitemap */}
            <div className={css.universityColumn}>
              <div>
                <h3 className={css.universityTitle}>
                  Northeastern
                  <br />
                  University
                </h3>

                <address className={css.address}>
                  360 Huntington Ave,
                  <br />
                  Boston, MA 02115
                </address>
              </div>

              <div>
                <h4 className={css.sectionTitle}>Sitemap</h4>

                <nav className={css.sitemapNav}>
                  <Link href="/" className={css.sitemapLink}>
                    Home
                  </Link>

                  <Link href="/glossary" className={css.sitemapLink}>
                    Glossary of Terms
                  </Link>

                  <Link href="/search" className={css.sitemapLink}>
                    Word Search
                  </Link>

                  <Link href="/goals" className={css.sitemapLink}>
                    Goals
                  </Link>

                  <Link href="/team" className={css.sitemapLink}>
                    Team
                  </Link>
                </nav>
              </div>
            </div>

            {/* About */}
            <div className={css.aboutSection}>
              <h4 className={css.sectionTitle}>About</h4>

              <p className={css.aboutText}>
                The Digital Archive of Indigenous Language Persistence (DAILP) by{" "}
                <Link
                  href="https://www.ellencushman.com"
                  className={css.aboutLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ellen Cushman
                </Link>
                ,{" "}
                <Link
                  href="https://snead.xyz"
                  className={css.aboutLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Shelby Snead
                </Link>
                , Naomi Trevino, Jeffrey Bourns, Aparna Dutta, and Henry Volchonok is
                licensed under{" "}
                <Link
                  href="https://creativecommons.org/licenses/by-nc/4.0/"
                  className={css.aboutLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  CC BY-NC 4.0
                </Link>

                <span className={css.ccIcons}>
                  <svg
                    className={css.ccIcon}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                    <text
                      x="12"
                      y="16"
                      fontSize="10"
                      textAnchor="middle"
                      fill="currentColor"
                    >
                      CC
                    </text>
                  </svg>

                  <svg
                    className={css.ccIcon}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                    <circle cx="12" cy="8" r="2" />
                    <path
                      d="M12 12v6"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>

                  <svg
                    className={css.ccIcon}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                    <text
                      x="12"
                      y="16"
                      fontSize="10"
                      textAnchor="middle"
                    >
                      $
                    </text>
                    <line
                      x1="4"
                      y1="4"
                      x2="20"
                      y2="20"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </span>
              </p>

              <p className={css.aboutText}>
                This project was created with help from the{" "}
                <Link
                  href="http://dsg.northeastern.edu/"
                  className={css.aboutLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Digital Scholarship Group
                </Link>{" "}
                at the{" "}
                <Link
                  href="http://library.northeastern.edu/"
                  className={css.aboutLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Northeastern University Library
                </Link>
              </p>

              <Link
                href="https://github.com/neu-dsg/dailp-encoding"
                className={css.sourceLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Browse the source code
              </Link>

              <p className={css.lastUpdated}>
                Last Updated on {buildDate.toDateString()}
              </p>
            </div>

            {/* Contact */}
            <div>
              <h4 className={css.sectionTitle}>Contact</h4>

              <nav className={css.contactNav}>
                <Link
                  href="mailto:contact@dailp.northeastern.edu"
                  className={css.contactLink}
                >
                  <i className="fa-regular fa-envelope" />
                  Email
                </Link>

                <Link
                  href="https://www.linkedin.com/company/dailp"
                  className={css.contactLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-linkedin-in" />
                  LinkedIn
                </Link>

                <Link
                  href="https://github.com/neu-dsg/dailp-encoding"
                  className={css.contactLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-github" />
                  GitHub
                </Link>
              </nav>
            </div>
          </div>

          {/* Copyright */}
          <div className={css.copyrightSection}>
            © {currentYear} Digital Archive of Indigenous Language Persistence
            (DAILP)
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
