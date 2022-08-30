import { Helmet } from "react-helmet"
import { Link } from "src/components"
import { fullWidth, paddedCenterColumn } from "src/style/utils.css"
import CWKWLayout from "./cwkw-layout"

// Renders the homepage for CWKW.
const CWKWPage = () => {
  // Placeholder for intro chapters.
  const introChapters = [
    { title: "Preface to Cherokees Writing the Keetoowah Way" },
    { title: "Acknowledgements" },
  ]

  // Placeholder for main chapters.
  const mainChapters = [
    { title: "Stories", author: "Carly Dou" },
    { title: "Governance Documents", author: "John Doe" },
  ]

  return (
    <CWKWLayout>
      <Helmet>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <main className={paddedCenterColumn}>
        <article className={fullWidth}>
          <h1>Cherokees Writing the Keetoowah Way</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>

          <h1>Overview of Collection</h1>
          <ol type="i">
            {introChapters.map((chapter, index) => (
              <li key={index}>
                <Link href="#">{`${chapter.title}`}</Link>
              </li>
            ))}
          </ol>

          <ol>
            {mainChapters.map((chapter, index) => (
              <li key={index}>
                <Link href="#">
                  {`${chapter.title},
                  ${chapter.author}`}
                </Link>
              </li>
            ))}
          </ol>
        </article>
      </main>
    </CWKWLayout>
  )
}

export default CWKWPage
