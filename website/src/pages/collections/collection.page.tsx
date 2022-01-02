import React from "react"
import { Breadcrumbs } from "src/breadcrumbs"
import * as Dailp from "src/graphql/dailp"
import * as Wordpress from "src/graphql/wordpress"
import Layout from "src/layout"
import Link from "src/link"
import { documentRoute } from "src/routes"
import { fullWidth, paddedCenterColumn } from "src/sprinkles.css"

// This collator allows us to sort strings for a particular locale.
const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
})

const CollectionPage = ({ slug }) => {
  const [{ data: dailp }] = Dailp.useCollectionQuery({
    variables: { slug },
  })
  const [{ data: wp }] = Wordpress.usePageQuery({
    variables: { slug },
  })
  const wpPage = wp?.page.__typename === "Page" && wp.page
  const documents = [...(dailp?.collection.documents ?? [])]
  // Sort documents into natural order by their ID.
  // This means that "10" comes after "9" instead of after "1".
  documents
    .sort((a, b) => collator.compare(a.id, b.id))
    .sort((a, b) =>
      collator.compare(a.orderIndex.toString(), b.orderIndex.toString())
    )

  return (
    <Layout title={dailp?.collection.name}>
      <main className={paddedCenterColumn}>
        <article className={fullWidth}>
          <header>
            <Breadcrumbs aria-label="Breadcrumbs">
              <Link href="/">Collections</Link>
            </Breadcrumbs>
            <h1>{dailp?.collection.name}</h1>
          </header>

          {wpPage ? (
            <div dangerouslySetInnerHTML={{ __html: wpPage.content }} />
          ) : null}

          <ul>
            {documents.map((document) => (
              <li key={document.slug}>
                <Link href={documentRoute(document.slug)}>
                  {document.title}
                </Link>
                {document.date && ` (${document.date.year})`}
              </li>
            ))}
          </ul>
        </article>
      </main>
    </Layout>
  )
}
export default CollectionPage
