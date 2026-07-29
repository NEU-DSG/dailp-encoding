import React from "react"
import { UserRole } from "src/auth"
import { Link } from "src/components"
import { AuthGuard } from "src/components/auth-guard"
import { EditableToc } from "src/components/editable/toc/EditToc"
import * as Dailp from "src/graphql/dailp"
import Layout from "src/layout"
import { useLocation } from "src/renderer/PageShell"

const EditTocPage = ({ collectionSlug }: { collectionSlug: string }) => {
  const location = useLocation()

  const [{ data, fetching }, refetch] = Dailp.useEditedCollectionQuery({
    variables: { slug: collectionSlug! },
  })

  if (!collectionSlug) {
    return <div>Collection slug not found</div>
  }
  return (
    <AuthGuard requiredRoles={[UserRole.Editor]}>
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
    </AuthGuard>
  )
}

export const Page = EditTocPage
