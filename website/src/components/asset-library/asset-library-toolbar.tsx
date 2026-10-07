import React, { useRef } from "react"
import { MdGridView, MdViewList } from "react-icons/md/index"
import {
  Menu,
  MenuButton,
  MenuItem,
  useDialogState,
  useMenuState,
} from "reakit"
import type * as Dailp from "src/graphql/dailp"
import * as css from "./asset-library.css"
import { Breadcrumbs } from "./breadcrumbs"
import { NameModal } from "./name-modal"
import { ACCEPTED_TYPES } from "./sniff-image-type"
import type { ViewMode } from "./types"

interface AssetLibraryToolbarProps {
  viewMode: ViewMode
  onViewModeChange: (viewMode: ViewMode) => void
  path: string
  onOpenFolder: (folder: Dailp.FolderFieldsFragment | null) => void
  onFilesSelected: (files: File[]) => void
  onCreateFolder: (name: string) => void
  selecting: boolean
  onToggleSelecting: () => void
  search: string
  onSearchChange: (search: string) => void
}

export const AssetLibraryToolbar = (p: AssetLibraryToolbarProps) => {
  const fileInput = useRef<HTMLInputElement>(null)
  const newMenu = useMenuState({ placement: "bottom-start", gutter: 4 })
  const folderDialog = useDialogState()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    // Reset so picking the same file again still fires onChange.
    event.target.value = ""
    if (files.length) p.onFilesSelected(files)
  }

  return (
    <>
      <div className={css.toolbar}>
        <input
          className={css.search}
          type="search"
          placeholder="Search the library"
          aria-label="Search the asset library"
          value={p.search}
          onChange={(event) => p.onSearchChange(event.target.value)}
        />

        <input
          ref={fileInput}
          type="file"
          multiple
          accept={ACCEPTED_TYPES.join(",")}
          hidden
          onChange={handleChange}
        />
        <button
          type="button"
          className={css.toolbarButton}
          onClick={p.onToggleSelecting}
          aria-pressed={p.selecting}
        >
          {p.selecting ? "Cancel" : "Select"}
        </button>
        <MenuButton {...newMenu} className={css.toolbarButton} type="button">
          New
        </MenuButton>
        <Menu {...newMenu} aria-label="New" className={css.popupMenu}>
          <MenuItem
            {...newMenu}
            as="button"
            type="button"
            className={css.popupMenuItem}
            // Search results span the whole library, so there is no folder to create in.
            disabled={Boolean(p.search)}
            onClick={() => {
              newMenu.hide()
              folderDialog.show()
            }}
          >
            Folder
          </MenuItem>
          <MenuItem
            {...newMenu}
            as="button"
            type="button"
            className={css.popupMenuItem}
            onClick={() => {
              newMenu.hide()
              fileInput.current?.click()
            }}
          >
            Upload image
          </MenuItem>
        </Menu>
        {/* After the menu, so its focus lands after the menu hands focus back. */}
        <NameModal
          dialog={folderDialog}
          title="New folder"
          label="Folder name"
          onConfirm={p.onCreateFolder}
        />

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

      {/* Search results come from the whole library, so a trail describing the
          folder you left would be describing something you are not looking at. */}
      {!p.search && <Breadcrumbs path={p.path} onOpenFolder={p.onOpenFolder} />}
    </>
  )
}
