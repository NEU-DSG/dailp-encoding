import { Helmet } from "react-helmet"
import { WordpressPage } from "src/components"

const IndexPage = () => (
  <>
    <WordpressPage slug="/cwkw-index-page/" />
    <Helmet>
      <meta name="robots" content="noindex,nofollow" />
    </Helmet>
  </>
)

export default IndexPage
