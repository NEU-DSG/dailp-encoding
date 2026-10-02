import React from "react"
import { MdImage } from "react-icons/md/index"
import type * as Dailp from "src/graphql/dailp"
import * as css from "./asset-library.css"
import { formatBytes, formatDate, formatMimeType } from "./format"

interface ImageItemProps {
  image: Dailp.ImageFieldsFragment
  selected: boolean
  onSelect: () => void
  // Primary action: insert this image into the page being edited.
  onInsert: () => void
}

/**
 * Image-specific presentation, shared by both layouts -- thumbnail source,
 * accessible label, and the metadata columns.
 */
export function useImageDisplay(image: Dailp.ImageFieldsFragment) {
  return {
    label: image.filename,
    alt: image.altText || image.filename,
    thumbnailSrc: image.s3Url,
    type: formatMimeType(image.mimeType),
    size: formatBytes(image.sizeBytes),
    dimensions: `${image.width} × ${image.height}`,
    created: formatDate(image.createdAt),
  }
}

export const ImageGridCard = (p: ImageItemProps) => {
  const display = useImageDisplay(p.image)
  return (
    <button
      type="button"
      className={p.selected ? css.imageCard.selected : css.imageCard.unselected}
      onClick={p.onSelect}
      onDoubleClick={p.onInsert}
      aria-label={`Image ${display.label}`}
    >
      <img
        className={css.thumbnail}
        src={display.thumbnailSrc}
        alt={display.alt}
        loading="lazy"
      />
      <span className={css.cardLabel}>
        <MdImage size={18} aria-hidden />
        <span className={css.itemName}>{display.label}</span>
      </span>
    </button>
  )
}

export const ImageListRow = (p: ImageItemProps) => {
  const display = useImageDisplay(p.image)
  return (
    <tr
      className={p.selected ? css.listRow.selected : css.listRow.unselected}
      onClick={p.onSelect}
      onDoubleClick={p.onInsert}
    >
      <td className={css.listCell}>
        <div className={css.listNameCell}>
          <MdImage size={20} aria-hidden />
          <span className={css.itemName}>{display.label}</span>
        </div>
      </td>
      <td className={css.listMetaCell}>{display.type}</td>
      <td className={css.listMetaCell}>{display.size}</td>
      <td className={css.listMetaCell}>{display.created}</td>
    </tr>
  )
}
