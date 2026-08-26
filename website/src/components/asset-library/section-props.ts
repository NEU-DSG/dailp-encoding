import type * as Dailp from "src/graphql/dailp"
import type { Selection } from "./types"

/**
 * What both layouts receive. Folders and images arrive as separate arrays
 * (that is how `folderContents` returns them), so neither layout needs to
 * discriminate between item types at runtime.
 */
export interface AssetSectionProps {
  folders: readonly Dailp.FolderFieldsFragment[]
  images: readonly Dailp.ImageFieldsFragment[]
  selected: Selection | null
  onSelect: (selection: Selection) => void
  onOpenFolder: (folderPath: string) => void
  onInsertImage: (image: Dailp.ImageFieldsFragment) => void
}
