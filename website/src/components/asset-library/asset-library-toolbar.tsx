import React from "react"
import { MdGridView, MdViewList } from "react-icons/md/index"
import { Button } from "src/components"
import * as css from "./asset-library.css"
import type { ViewMode } from "./types"

interface AssetLibraryToolbarProps {
  viewMode: ViewMode
  onViewModeChange: (viewMode: ViewMode) => void
  path: string
  onOpenFolder: (folderPath: string) => void
}

export const AssetLibraryToolbar = (p: AssetLibraryToolbarProps) => (
  <div className={css.toolbar}>
    {/* Stub: visible so the layout is right, not yet wired to a query. */}
    <input
      className={css.search}
      type="search"
      placeholder="Search the library"
      aria-label="Search the asset library"
      disabled
    />

    {/* Stub: upload flow is a later iteration. */}
    <Button type="button" disabled>
      Upload
    </Button>

    <div className={css.viewToggle} role="group" aria-label="View mode">
      <button
        type="button"
        className={
          p.viewMode === "list"
            ? css.viewToggleButton.active
            : css.viewToggleButton.inactive
        }
        onClick={() => p.onViewModeChange("list")}
        aria-label="List view"
        aria-pressed={p.viewMode === "list"}
      >
        <MdViewList size={20} />
      </button>
      <button
        type="button"
        className={
          p.viewMode === "grid"
            ? css.viewToggleButton.active
            : css.viewToggleButton.inactive
        }
        onClick={() => p.onViewModeChange("grid")}
        aria-label="Grid view"
        aria-pressed={p.viewMode === "grid"}
      >
        <MdGridView size={20} />
      </button>
    </div>
  </div>
)
