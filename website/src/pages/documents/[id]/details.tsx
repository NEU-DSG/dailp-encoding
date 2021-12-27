import React from "react"
import Layout from "src/layout"
import { Helmet } from "react-helmet"
import { DocumentTitleHeader } from "src/pages/documents/[id]"
import { css } from "@emotion/react"
import { fullWidth } from "src/theme"
import * as Dailp from "src/graphql/dailp"
import { getStaticQueriesNew } from "src/graphql"

const DocumentDetails = ({ id }) => {
  const [{ data }] = Dailp.useDocumentDetailsQuery({ variables: { id } })
  if (!data) {
    return null
  }
  const doc = data.document
  return (
    <Layout>
      <main>
        <Helmet>
          <title>{doc.title} - Details</title>
        </Helmet>
        <DocumentTitleHeader doc={doc} showDetails={false} />
        <section css={wideSection}>
          <h3>Contributors</h3>
          <ul>
            {doc.contributors.map((person) => (
              <li key={person.name}>
                {person.name}: {person.role}
              </li>
            ))}
          </ul>
        </section>
        {doc.sources.length ? (
          <section css={wideSection}>
            Original document provided courtesy of{" "}
            <a href={doc.sources[0].link}>{doc.sources[0].name}</a>.
          </section>
        ) : null}
      </main>
    </Layout>
  )
}
export default DocumentDetails

export const getStaticProps = getStaticQueriesNew(async (params, dailp, wp) => {
  await dailp
    .query(Dailp.DocumentDetailsDocument, { id: params.id })
    .toPromise()
  return params
})

export { getStaticPaths } from "../[id]"

const wideSection = css`
  ${fullWidth}
`
