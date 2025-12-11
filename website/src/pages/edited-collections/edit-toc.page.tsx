import React from "react"
import { Link } from "src/components"
import { EditableToc } from "src/components/editable/EditToc"
import * as Dailp from "src/graphql/dailp"
import Layout from "src/layout"
import { useLocation, useRouteParams } from "src/renderer/PageShell"

const EditTocPage = () => {
  const location = useLocation()
  const collectionSlug = location.search["collectionSlug"]

  const [{ data, fetching }, refetch] = Dailp.useEditedCollectionQuery({
    variables: { slug: collectionSlug! },
  })

  if (!collectionSlug) {
    return <div>Collection slug not found</div>
  }
  return (
    <Layout>
      <main>
        {data == undefined || data.editedCollection == null ? (
          <div>
            No collection data for slug{" "}
            <span style={{ fontWeight: "bold" }}>{collectionSlug}</span> found
            <br />
            <Link href={`/collections/new`}>Create a new collection</Link>
            <br />
            <Link href={`/`}>Back to home</Link>
          </div>
        ) : (
          <>
            <h1 style={{ marginBottom: 16 }}>Edit Table of Contents</h1>
            <Link href={`/collections/${collectionSlug}`}>
              Back to collection
            </Link>
            <br />
            <EditableToc collectionSlug={collectionSlug} />
          </>
        )}
      </main>
    </Layout>
  )
}

export const Page = EditTocPage
