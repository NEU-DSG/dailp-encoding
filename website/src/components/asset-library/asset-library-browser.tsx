import React from "react"
import type * as Dailp from "src/graphql/dailp"
import { AssetGrid } from "./asset-grid"
import * as css from "./asset-library.css"
import { AssetList } from "./asset-list"
import type { Selection, ViewMode } from "./types"
import { useLibraryContents } from "./use-library-contents"

interface AssetLibraryBrowserProps {
  path: string
  viewMode: ViewMode
  selected: Selection | null
  onSelect: (selection: Selection) => void
  onOpenFolder: (folderPath: string) => void
  onInsertImage: (image: Dailp.ImageFieldsFragment) => void
}

// Lists one folder's contents in the current view mode.
export const AssetLibraryBrowser = (p: AssetLibraryBrowserProps) => {
  const { folders, images, fetching, error } = useLibraryContents(p.path)

  let content: React.ReactNode

  if (fetching) {
    content = <p className={css.emptyMessage}>Loading…</p>
  } else if (error) {
    content = (
      <p className={css.emptyMessage}>
        Could not load the asset library: {error.message}
      </p>
    )
  } else if (folders.length === 0 && images.length === 0) {
    content = <p className={css.emptyMessage}>This folder is empty.</p>
  } else {
    const Layout = p.viewMode === "grid" ? AssetGrid : AssetList
    content = (
      <Layout
        folders={folders}
        images={images}
        selected={p.selected}
        onSelect={p.onSelect}
        onOpenFolder={p.onOpenFolder}
        onInsertImage={p.onInsertImage}
      />
    )
  }

  return <div className={css.browser}>{content}</div>
}
