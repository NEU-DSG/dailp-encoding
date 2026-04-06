import React from "react"
import * as Dailp from "src/graphql/dailp"
import PageImages from "../../page-image"
import { PrintLayout } from "./print-layout"
import * as css from "./print-translation.css"

export const PrintOriginalText = (p: {
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
      <h2 className={css.printSectionHeading}>
        Original Document
        <span className={css.printSectionHeadingRule} />
      </h2>
      {p.doc.translatedPages ? (
        <PageImages
          pageImages={{
            urls:
              p.doc.translatedPages
                ?.filter((page) => !!page.image)
                .map((page) => page.image!.url) ?? [],
          }}
          document={p.doc}
        />
      ) : null}
    </PrintLayout>
  )
}
