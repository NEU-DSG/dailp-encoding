import { useMemo } from "react"
import * as Dailp from "src/graphql/dailp"

/**
 * The single data seam for the asset library.
 *
 * `path` is a slugified folder path such as "partners.logos"; the empty string
 * is the root of the library.
 *
 * Everything the browser renders comes through here, which matters for one
 * reason in particular: `list_folders.sql` / `list_images.sql` deliberately
 * return soft-deleted rows ("callers filter deleted_at in code"). Filtering in
 * one place keeps deleted images out of the picker -- if each component
 * filtered for itself, a single omission would let a deleted image be inserted
 * into a page. A trash toggle would also plug in here later.
 */
export function useLibraryContents(path: string) {
  const [{ data, fetching, error }] = Dailp.useFolderContentsQuery({
    variables: { path },
  })

  const contents = data?.folderContents

  return useMemo(
    () => ({
      // Soft-deleted rows never reach the UI.
      folders: (contents?.folders ?? []).filter((f) => !f.deletedAt),
      images: (contents?.images ?? []).filter((i) => !i.deletedAt),
      fetching,
      error,
    }),
    [contents, fetching, error]
  )
}
