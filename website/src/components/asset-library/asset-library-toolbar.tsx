import React, { useRef } from "react"
import { MdGridView, MdViewList } from "react-icons/md/index"
import { Button } from "src/components"
import type * as Dailp from "src/graphql/dailp"
import * as css from "./asset-library.css"
import { ACCEPTED_TYPES } from "./sniff-image-type"
import type { ViewMode } from "./types"

interface AssetLibraryToolbarProps {
  viewMode: ViewMode
  onViewModeChange: (viewMode: ViewMode) => void
  path: string
  onOpenFolder: (folder: Dailp.FolderFieldsFragment) => void
  onFilesSelected: (files: File[]) => void
  uploading: boolean
}

export const AssetLibraryToolbar = (p: AssetLibraryToolbarProps) => {
  const fileInput = useRef<HTMLInputElement>(null)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    // Reset so picking the same file again still fires onChange.
    event.target.value = ""
    if (files.length) p.onFilesSelected(files)
  }

  return (
    <div className={css.toolbar}>
      {/* Stub: visible so the layout is right, not yet wired to a query. */}
      <input
        className={css.search}
        type="search"
        placeholder="Search the library"
        aria-label="Search the asset library"
        disabled
      />

      <input
        ref={fileInput}
        type="file"
        multiple
        // Advisory only - the browser filters by extension, so the real check
        // is the byte sniffing that runs once a file is chosen.
        accept={ACCEPTED_TYPES.join(",")}
        hidden
        onChange={handleChange}
      />
      <Button
        type="button"
        onClick={() => fileInput.current?.click()}
        disabled={p.uploading}
      >
        {p.uploading ? "Uploading…" : "Upload"}
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
}
