import React from "react"
import type { CombinedError } from "urql"
import { AssetGrid } from "./asset-grid"
import * as css from "./asset-library.css"
import { AssetList } from "./asset-list"
import type { AssetSectionProps } from "./section-props"
import type { ViewMode } from "./types"

interface AssetLibraryBrowserProps extends AssetSectionProps {
  viewMode: ViewMode
  fetching: boolean
  error?: CombinedError
}

/**
 * Lists one folder's contents in the current view mode.
 *
 * The query itself lives in the modal, which needs its `refetch` to refresh the
 * listing as uploads complete.
 */
export const AssetLibraryBrowser = (p: AssetLibraryBrowserProps) => {
  const { folders, images, fetching, error } = p

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
