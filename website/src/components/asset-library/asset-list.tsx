import React from "react"
import * as css from "./asset-library.css"
import { FolderListRow } from "./folder-item"
import { ImageListRow } from "./image-item"
import type { AssetSectionProps } from "./section-props"

/**
 * Table layout, like Google Drive's list view. A real table (rather than per-item
 * markup) is what keeps the Name/Type/Size/Created columns aligned across
 * folder and image rows alike.
 */
export const AssetList = (p: AssetSectionProps) => (
  <table className={css.list}>
    <thead>
      <tr>
        {/* Sorting is not wired up yet. */}
        <th className={css.listHeaderCell}>Name</th>
        <th className={css.listHeaderCell}>Type</th>
        <th className={css.listHeaderCell}>Size</th>
        <th className={css.listHeaderCell}>Created</th>
      </tr>
    </thead>
    <tbody>
      {p.folders.map((folder) => (
        <FolderListRow
          key={folder.id}
          folder={folder}
          selected={p.isSelected(folder.id)}
          onSelect={() => p.onSelect({ kind: "folder", folder })}
          onOpen={() => p.onOpenFolder(folder)}
          onContextMenu={(event) =>
            p.onContextMenu({ kind: "folder", folder }, event)
          }
        />
      ))}
      {p.images.map((image) => (
        <ImageListRow
          key={image.id}
          image={image}
          selected={p.isSelected(image.id)}
          onSelect={() => p.onSelect({ kind: "image", image })}
          onInsert={() => p.onInsertImage(image)}
          onContextMenu={(event) =>
            p.onContextMenu({ kind: "image", image }, event)
          }
        />
      ))}
    </tbody>
  </table>
)
