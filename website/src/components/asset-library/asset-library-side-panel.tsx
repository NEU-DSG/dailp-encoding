import React from "react"
import type * as Dailp from "src/graphql/dailp"
import * as css from "./asset-library.css"
import { useFolderDisplay } from "./folder-item"
import { useImageDisplay } from "./image-item"
import type { SelectedItem } from "./types"

interface SidePanelProps {
  selected: readonly SelectedItem[]
  // Absent when the library was opened somewhere with nothing to insert into.
  onInsertImage?: (image: Dailp.ImageFieldsFragment) => void
}

export const AssetLibrarySidePanel = (p: SidePanelProps) => (
  <aside className={css.sidePanel} aria-label="Item details">
    <PanelContent {...p} />
  </aside>
)

const PanelContent = ({ selected, onInsertImage }: SidePanelProps) => {
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
    <ImagePanel
      image={item.image}
      onInsert={onInsertImage && (() => onInsertImage(item.image))}
    />
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

const ImagePanel = (p: {
  image: Parameters<typeof useImageDisplay>[0]
  onInsert?: () => void
}) => {
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
      {p.onInsert && (
        <button type="button" className={css.insertButton} onClick={p.onInsert}>
          Insert at cursor
        </button>
      )}
    </>
  )
}
