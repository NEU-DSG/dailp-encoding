import React from "react"
import { graphql } from "gatsby"
import { css } from "@emotion/react"
import { sortBy, join } from "lodash"
import Layout from "../layout"
import { fullWidth, std, typography, paddedWidth } from "../theme"
import { sourceCitationId } from "../routes"

const SourcesPage = (p: { data: GatsbyTypes.AllSourcesQuery }) => {
  return (
    <Layout title="Sources Index">
      <main css={wideChildren}>
        <h1>Sources of Cherokee Language Data</h1>
        <p>
          This is a cited list of the lexical language resources that we use to
          identify and correlate words in a document. The list includes
          dictionaries and grammars written as early as the 18th century and as
          recent as the 2000s. Each citation is written generally following the{" "}
          <a href="https://apastyle.apa.org/">APA style</a>, like so:
          <br />
          Document ID = Last name, First name; ... (Year published).{" "}
          <i>Title of the document</i>. Number of words referenced.
        </p>

        <ul css={wide}>
          {sortBy(
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
export default SourcesPage

type LocalDocument = GatsbyTypes.AllSourcesQuery["dailp"]["allDocuments"][0]

const DocumentCitation = (p: { document: LocalDocument }) => {
  const doc = p.document
  const year = doc.date?.year
  const authors = join(
    doc.contributors.map((author) => author.name),
    "; "
  )
  const wordCount = doc.formCount ? ` ${doc.formCount} words.` : null
  return (
    <li id={sourceCitationId(doc.id)} css={apaCitation}>
      <span css={bolded}>{doc.id}</span> = {authors} {year && `(${year})`}.{" "}
      <i>{doc.title}</i>.{wordCount}
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
    ${paddedWidth};
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
