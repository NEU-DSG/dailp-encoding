import React from "react"
import * as css from "./asset-library.css"
import { FolderGridCard } from "./folder-item"
import { ImageGridCard } from "./image-item"
import type { AssetSectionProps } from "./section-props"

/**
 * Card layout, like Google Drive's grid view. Folders render as compact chips above a
 * grid of image thumbnails.
 */
export const AssetGrid = (p: AssetSectionProps) => (
  <>
    {p.folders.length > 0 && (
      <>
        <h3 className={css.sectionHeading}>Folders</h3>
        <div className={css.folderGrid}>
          {p.folders.map((folder) => (
            <FolderGridCard
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
        </div>
      </>
    )}

    {p.images.length > 0 && (
      <>
        <h3 className={css.sectionHeading}>Images</h3>
        <div className={css.imageGrid}>
          {p.images.map((image) => (
            <ImageGridCard
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
        </div>
      </>
    )}
  </>
)
