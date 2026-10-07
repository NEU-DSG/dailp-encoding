import React from "react"
import * as css from "./asset-library.css"
import { useFolderDisplay } from "./folder-item"
import { useImageDisplay } from "./image-item"
import type { SelectedItem } from "./types"

export const AssetLibrarySidePanel = (p: {
  selected: readonly SelectedItem[]
}) => (
  <aside className={css.sidePanel} aria-label="Item details">
    <PanelContent selected={p.selected} />
  </aside>
)

const PanelContent = ({ selected }: { selected: readonly SelectedItem[] }) => {
  const [item] = selected
  if (!item) {
    return (
      <p className={css.sidePanelPlaceholder}>
        Select an item to see its details.
      </p>
    )
  }
  if (selected.length > 1) {
    return (
      <p className={css.sidePanelPlaceholder}>
        {selected.length} items selected.
      </p>
    )
  }
  return item.kind === "folder" ? (
    <FolderPanel folder={item.folder} />
  ) : (
    <ImagePanel image={item.image} />
  )
}

const FolderPanel = (p: { folder: Parameters<typeof useFolderDisplay>[0] }) => {
  const display = useFolderDisplay(p.folder)
  return (
    <>
      <h3 className={css.sectionHeading}>{display.label}</h3>
      <dl>
        <dt>Type</dt>
        <dd>{display.type}</dd>
        <dt>Size</dt>
        <dd>{display.size}</dd>
        <dt>Created</dt>
        <dd>{display.created}</dd>
      </dl>
    </>
  )
}

const ImagePanel = (p: { image: Parameters<typeof useImageDisplay>[0] }) => {
  const display = useImageDisplay(p.image)
  return (
    <>
      <h3 className={css.sectionHeading}>{display.label}</h3>
      <img
        className={css.thumbnail}
        src={display.thumbnailSrc}
        alt={display.alt}
      />
      <dl>
        <dt>Type</dt>
        <dd>{display.type}</dd>
        <dt>Dimensions</dt>
        <dd>{display.dimensions}</dd>
        <dt>Size</dt>
        <dd>{display.size}</dd>
        <dt>Created</dt>
        <dd>{display.created}</dd>
      </dl>
    </>
  )
}
