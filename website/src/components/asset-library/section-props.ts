import type React from "react"
import type * as Dailp from "src/graphql/dailp"
import type { SelectedItem } from "./types"

/**
 * What both layouts receive. Folders and images arrive as separate arrays
 * (that is how `folderContents` returns them), so neither layout needs to
 * discriminate between item types at runtime.
 */
export interface AssetSectionProps {
  folders: readonly Dailp.FolderFieldsFragment[]
  images: readonly Dailp.ImageFieldsFragment[]
  isSelected: (id: string) => boolean
  onSelect: (item: SelectedItem) => void
  onContextMenu: (item: SelectedItem, event: React.MouseEvent) => void
  onOpenFolder: (folder: Dailp.FolderFieldsFragment) => void
  onInsertImage: (image: Dailp.ImageFieldsFragment) => void
}
