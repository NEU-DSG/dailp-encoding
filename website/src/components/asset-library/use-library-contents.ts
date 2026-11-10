import { useCallback, useMemo } from "react"
import * as Dailp from "src/graphql/dailp"

/**
 * The single data seam for the asset library.
 *
 * `path` is a slugified folder path such as "partners.logos"; the empty string
 * is the root of the library. A non-empty `search` replaces the folder listing
 * with matches from anywhere in the library, and `trash` replaces either with
 * what is in the trash.
 *
 * Everything the browser renders comes through here, which matters for one
 * reason in particular: `list_folders.sql` / `list_images.sql` deliberately
 * return soft-deleted rows ("callers filter deleted_at in code"). Filtering in
 * one place keeps deleted images out of the picker -- if each component
 * filtered for itself, a single omission would let a deleted image be inserted
 * into a page.
 */
export function useLibraryContents(
  path: string,
  search: string,
  trash = false
) {
  const query = search.trim()
  const searching = query.length > 0

  // Only one of these runs at a time; the others stay paused.
  const [browse, reexecuteBrowse] = Dailp.useFolderContentsQuery({
    variables: { path },
    pause: trash || searching,
  })
  const [results, reexecuteSearch] = Dailp.useSearchLibraryQuery({
    variables: { query },
    pause: trash || !searching,
  })
  const [trashed, reexecuteTrash] = Dailp.useListTrashQuery({ pause: !trash })

  const active = trash ? trashed : searching ? results : browse
  const contents = trash
    ? trashed.data?.listTrash
    : searching
    ? results.data?.searchLibrary
    : browse.data?.folderContents

  // Uploads add rows the cache cannot know about, so the listing is re-fetched
  // from the network rather than served from cache.
  const refetch = useCallback(() => {
    const reexecute = trash
      ? reexecuteTrash
      : searching
      ? reexecuteSearch
      : reexecuteBrowse
    reexecute({ requestPolicy: "network-only" })
  }, [trash, searching, reexecuteTrash, reexecuteSearch, reexecuteBrowse])

  return useMemo(
    () => ({
      // Soft-deleted rows only reach the UI in the trash.
      folders: (contents?.folders ?? []).filter(
        (f) => Boolean(f.deletedAt) === trash
      ),
      images: (contents?.images ?? []).filter(
        (i) => Boolean(i.deletedAt) === trash
      ),
      fetching: active.fetching,
      error: active.error,
      refetch,
    }),
    [contents, trash, active.fetching, active.error, refetch]
  )
}
