import React from "react"
import Link from "next/link"
import Layout from "src/layout"
import { DocIndex, FullWidth } from "src/pages/index"
import { documentRoute } from "src/routes"
import { Breadcrumbs } from "src/breadcrumbs"
import * as Dailp from "src/graphql/dailp"
import * as Wordpress from "src/graphql/wordpress"
import { client, getStaticQueriesNew } from "src/graphql"
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next"

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
  const wpPage = wp?.pages.nodes[0]
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
      <DocIndex>
        <FullWidth>
          <header>
            <Breadcrumbs aria-label="Breadcrumbs">
              <li>
                <Link href="/">Collections</Link>
              </li>
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
        </FullWidth>
      </DocIndex>
    </Layout>
  )
}
export default CollectionPage

export const getStaticProps = getStaticQueriesNew(async (params, dailp, wp) => {
  await wp.query(Wordpress.MainMenuDocument).toPromise()
  await dailp
    .query<Dailp.CollectionQuery, Dailp.CollectionQueryVariables>(
      Dailp.CollectionDocument,
      { slug: params.slug as string }
    )
    .toPromise()
  await wp
    .query<Wordpress.PageQuery, Wordpress.PageQueryVariables>(
      Wordpress.PageDocument,
      { slug: params.slug as string }
    )
    .toPromise()
  return { slug: params.slug }
})

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await client.dailp
    .query<
      Dailp.CollectionsListingQuery,
      Dailp.CollectionsListingQueryVariables
    >(Dailp.CollectionsListingDocument)
    .toPromise()

  return {
    paths: data.allCollections.map((collection) => ({
      params: { slug: collection.slug },
    })),
    fallback: false,
  }
}
