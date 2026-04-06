import React from "react"
import * as Dailp from "src/graphql/dailp"
import { PrintLayout } from "./print-layout"

export const PrintMetadata = (p: {
  doc: Dailp.DocumentFieldsFragment
  breadcrumbs?: readonly Pick<
    Dailp.CollectionChapter["breadcrumbs"][0],
    "name" | "slug"
  >[]
  rootPath?: string
  collectionTitle?: string
}) => {
  return (
    <PrintLayout
      doc={p.doc}
      breadcrumbs={p.breadcrumbs}
      rootPath={p.rootPath}
      collectionTitle={p.collectionTitle}
    >
      <h2>Document Info</h2>
    </PrintLayout>
  )
}
