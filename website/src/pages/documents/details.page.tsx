import React from "react"
import { Helmet } from "react-helmet"
import * as Dailp from "src/graphql/dailp"
import Layout from "src/layout"
import { fullWidth } from "src/sprinkles.css"
import { DocumentTitleHeader } from "./document.page"

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
        <section className={fullWidth}>
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
          <section className={fullWidth}>
            Original document provided courtesy of{" "}
            <a href={doc.sources[0].link}>{doc.sources[0].name}</a>.
          </section>
        ) : null}
      </main>
    </Layout>
  )
}
export default DocumentDetails
