import { Helmet } from "react-helmet"
import { Breadcrumbs, Link, WordpressPage } from "src/components"
import * as Dailp from "src/graphql/dailp"
import Layout from "src/layout"
import { useRouteParams } from "src/renderer/PageShell"
import { redirectDocumentRoute } from "src/routes"
import { fullWidth, paddedCenterColumn } from "src/style/utils.css"

const CollectionPage = () => {
  const { slug } = useRouteParams()
  const [{ data: dailp }] = Dailp.useCollectionQuery({
    variables: { slug: slug! },
  })
  const documents = [...(dailp?.collection.documents ?? [])]
  // Sort documents into natural order by their ID.
  // This means that "10" comes after "9" instead of after "1".
  documents
    .sort((a, b) => collator.compare(a.id, b.id))
    .sort((a, b) =>
      collator.compare(a.orderIndex.toString(), b.orderIndex.toString())
    )

  return (
    <Layout>
      <Helmet title={dailp?.collection.name} />
      <main className={paddedCenterColumn}>
        <article className={fullWidth}>
          <header>
            <Breadcrumbs>
              <Link href="/">Collections</Link>
            </Breadcrumbs>
            <h1>{dailp?.collection.name}</h1>
          </header>
          <WordpressPage slug={slug!} />
          <ul>
            {documents.map((document) => (
              <li key={document.slug}>
                <Link
                  href={
                    // If this document exists within a collection's chapter, then redirect to that chapter page.
                    document.chapterPath
                      ? redirectDocumentRoute(document.chapterPath as string[])
                      : undefined
                  }
                >
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

// This collator allows us to sort strings for a particular locale.
const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
})
