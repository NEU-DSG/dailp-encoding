import { useCallback, useMemo } from "react"
import * as Dailp from "src/graphql/dailp"

/**
 * The single data seam for the asset library.
 *
 * `path` is a slugified folder path such as "partners.logos"; the empty string
 * is the root of the library. A non-empty `search` replaces the folder listing
 * with matches from anywhere in the library.
 *
 * Everything the browser renders comes through here, which matters for one
 * reason in particular: `list_folders.sql` / `list_images.sql` deliberately
 * return soft-deleted rows ("callers filter deleted_at in code"). Filtering in
 * one place keeps deleted images out of the picker -- if each component
 * filtered for itself, a single omission would let a deleted image be inserted
 * into a page. A trash toggle would also plug in here later.
 */
export function useLibraryContents(path: string, search: string) {
  const query = search.trim()
  const searching = query.length > 0

  // Only one of these runs at a time; the other stays paused.
  const [browse, reexecuteBrowse] = Dailp.useFolderContentsQuery({
    variables: { path },
    pause: searching,
  })
  const [results, reexecuteSearch] = Dailp.useSearchLibraryQuery({
    variables: { query },
    pause: !searching,
  })

  const active = searching ? results : browse
  const contents = searching
    ? results.data?.searchLibrary
    : browse.data?.folderContents

  // Uploads add rows the cache cannot know about, so the listing is re-fetched
  // from the network rather than served from cache.
  const refetch = useCallback(() => {
    const reexecute = searching ? reexecuteSearch : reexecuteBrowse
    reexecute({ requestPolicy: "network-only" })
  }, [searching, reexecuteSearch, reexecuteBrowse])

  return useMemo(
    () => ({
      // Soft-deleted rows never reach the UI.
      folders: (contents?.folders ?? []).filter((f) => !f.deletedAt),
      images: (contents?.images ?? []).filter((i) => !i.deletedAt),
      fetching: active.fetching,
      error: active.error,
      refetch,
    }),
    [contents, active.fetching, active.error, refetch]
  )
}
