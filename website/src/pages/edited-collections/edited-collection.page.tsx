import React from "react"
import { useRouteParams } from "src/renderer/PageShell"
import CollectionPage from "../collections/collection.page"
import CWKWPage from "../cwkw/cwkw.page"
import { DialogProvider } from "../cwkw/dialog-context"

// Renders an edited collection page based on the route parameters.
const EditedCollectionPage = () => {
  const { collectionSlug } = useRouteParams()

  if (collectionSlug === "cwkw") {
    return (
      <DialogProvider>
        <CWKWPage />
      </DialogProvider>
    )
  } else {
    return <CollectionPage />
  }
}
export default EditedCollectionPage
