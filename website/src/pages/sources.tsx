import React from "react"
import { graphql } from "gatsby"
import { css, cx } from "linaria"
import _ from "lodash"
import Layout from "../layout"
import { fullWidth, std, typography } from "../theme"
import { sourceCitationId } from "../routes"

export default (p: { data: GatsbyTypes.AllSourcesQuery }) => {
  return (
    <Layout title="Sources Index">
      <main className={wideChildren}>
        <h1>Sources of Cherokee Language Data</h1>
        <p>
          This is a cited list of the lexical language resources that we use to
          identify and correlate words in a document. The list includes
          dictionaries and grammars written as early as the 18th century and as
          recent as the 2000s. Each citation is written following the{" "}
          <a href="https://apastyle.apa.org/">APA style</a>, like so:
          <br />
          Document ID = Last name, First name, ... (Year published).{" "}
          <i>Title of the document</i>. Number of words referenced.
        </p>

        <ul className={wide}>
          {_.sortBy(
            p.data.dailp.allDocuments.filter((d) => d.isReference),
            (doc) => doc.id
          ).map((doc) => (
            // Cite each source in APA format.
            <DocumentCitation key={doc.id} document={doc} />
          ))}
        </ul>
      </main>
    </Layout>
  )
}

type LocalDocument = GatsbyTypes.AllSourcesQuery["dailp"]["allDocuments"][0]

const DocumentCitation = (p: { document: LocalDocument }) => {
  const doc = p.document
  const year = doc.date?.year
  const authors = _.join(
    doc.contributors.map((author) => author.name),
    ", "
  )
  const wordCount = doc.formCount ? ` ${doc.formCount} words.` : null
  return (
    <li id={sourceCitationId(doc.id)} className={apaCitation}>
      <span className={bolded}>{doc.id}</span> = {authors} {year && `(${year})`}
      . <i>{doc.title}</i>.{wordCount}
    </li>
  )
}

const apaCitation = css`
  padding-left: 4ch;
  text-indent: -4ch;
  margin-bottom: ${typography.rhythm(1)};
`
const wideChildren = css`
  & > * {
    ${fullWidth};
  }
`

const bolded = css`
  font-weight: bold;
`

const wide = css`
  list-style: none;
  margin-left: 0;
`

export const query = graphql`
  query AllSources {
    dailp {
      allDocuments {
        isReference
        id
        title
        date {
          year
        }
        contributors {
          name
        }
        formCount
      }
    }
  }
`
