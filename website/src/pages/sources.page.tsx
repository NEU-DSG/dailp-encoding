import { join, sortBy } from "lodash-es"
import React from "react"
import { Helmet } from "react-helmet"
import * as Dailp from "src/graphql/dailp"
import { Link } from "src/ui"
import Layout from "../layout"
import { sourceCitationId } from "../routes"
import { apaCitation, wideChild, wideList } from "./sources.css"

const SourcesPage = () => {
  const [{ data: dailp }] = Dailp.useAllSourcesQuery()
  return (
    <Layout>
      <Helmet title="Sources Index" />
      <main>
        <h1 className={wideChild}>Sources of Cherokee Language Data</h1>
        <p className={wideChild}>
          This is a cited list of the lexical language resources that we use to
          identify and correlate words in a document. The list includes
          dictionaries and grammars written as early as the 18th century and as
          recent as the 2000s. Each citation is written generally following the{" "}
          <Link href="https://apastyle.apa.org/">APA style</Link>, like so:
          <br />
          <b>Document ID:</b> Last name, First name; ... (Year published).{" "}
          <i>Title of the document</i>. Number of words referenced.
        </p>

        <ul className={wideList}>
          {sortBy(
            dailp?.allDocuments.filter((d) => d.isReference),
            (doc) => doc.slug
          ).map((doc) => (
            // Cite each source in APA format.
            <DocumentCitation key={doc.id} document={doc} />
          ))}
        </ul>
      </main>
    </Layout>
  )
}
export const Page = SourcesPage

type LocalDocument = Dailp.AllSourcesQuery["allDocuments"][0]

const DocumentCitation = (p: { document: LocalDocument }) => {
  const doc = p.document
  const year = doc.date?.year
  const authors = join(
    doc.contributors.map((author) => author.name),
    "; "
  )
  const wordCount = doc.formCount ? ` ${doc.formCount} words.` : null
  return (
    <li id={sourceCitationId(doc.slug)} className={apaCitation}>
      <b>{doc.slug.toUpperCase()}:</b> {authors} {year && `(${year})`}.{" "}
      <i>{doc.title}</i>.{wordCount}
    </li>
  )
}
