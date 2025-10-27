import React from "react"
import { EditableToc } from "src/components/editable/EditToc"
import Layout from "src/layout"
import { useRouteParams } from "src/renderer/PageShell"

const EditTocPage = () => {
  const routeParams = useRouteParams()
  const collectionSlug = routeParams?.["collectionSlug"] as string | undefined

  if (!collectionSlug) {
    return <div>Collection slug not found</div>
  }

  return (
    <Layout>
      <main>
        <h1 style={{ marginBottom: 16 }}>Edit Table of Contents</h1>
        <EditableToc collectionSlug={collectionSlug} />
      </main>
    </Layout>
  )
}

export const Page = EditTocPage
