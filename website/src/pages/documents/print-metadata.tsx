import React from "react"
import * as Dailp from "src/graphql/dailp"
import { PrintLayout } from "./print-layout"

export const PrintMetadata = (p: {
  doc: Dailp.DocumentFieldsFragment
  breadcrumbString?: string
}) => {
  return (
    <PrintLayout doc={p.doc} breadcrumbString={p.breadcrumbString}>
      <h2>Document Info</h2>
    </PrintLayout>
  )
}
