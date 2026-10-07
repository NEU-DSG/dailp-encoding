import React, { useRef } from "react"
import * as Dailp from "src/graphql/dailp"
import * as css from "./asset-library.css"

// Longest trail shown in full; past this the middle collapses.
const MAX_CRUMBS = 10
// What the root and the ellipsis leave for the trailing crumbs.
const TAIL = MAX_CRUMBS - 2

// A null `folder` is the library root, which has no row of its own.
interface Crumb {
  key: string
  label: string
  // Where clicking leads, when the label does not say. Only the ellipsis.
  title?: string
  folder: Dailp.FolderFieldsFragment | null
}

interface BreadcrumbsProps {
  path: string
  onOpenFolder: (folder: Dailp.FolderFieldsFragment | null) => void
}

export const Breadcrumbs = (p: BreadcrumbsProps) => {
  const [{ data }] = Dailp.useFolderBreadcrumbsQuery({
    variables: { path: p.path },
    // The resolver returns nothing for the root, so there is no call to make.
    pause: p.path === "",
  })

  // urql drops `data` while refetching, which would blink the trail back to
  // just "Library" on every navigation. Hold the last one until the next lands.
  const previous = useRef<readonly Dailp.FolderFieldsFragment[]>([])
  if (data?.folderBreadcrumbs) previous.current = data.folderBreadcrumbs
  const folders =
    p.path === "" ? [] : data?.folderBreadcrumbs ?? previous.current

  const items = collapse([
    { key: "root", label: "Library", folder: null },
    ...folders.map((folder) => ({
      key: folder.id,
      label: folder.name,
      folder,
    })),
  ])

  return (
    <nav aria-label="Breadcrumb">
      <ol className={css.breadcrumbs}>
        {items.map((crumb, index) => (
          <React.Fragment key={crumb.key}>
            {index > 0 && (
              <li className={css.crumbSeparator} aria-hidden>
                ›
              </li>
            )}
            <li className={css.crumbItem}>
              {index === items.length - 1 ? (
                <span className={css.crumbCurrent} aria-current="page">
                  {crumb.label}
                </span>
              ) : (
                <button
                  type="button"
                  className={css.crumb}
                  onClick={() => p.onOpenFolder(crumb.folder)}
                  title={crumb.title}
                  aria-label={crumb.title && `Go to ${crumb.title}`}
                >
                  {crumb.label}
                </button>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  )
}

/**
 * Keeps the root and the last `TAIL` crumbs, replacing the rest with an
 * ellipsis leading to the deepest folder it hides -- so clicking it repeatedly
 * walks back up a level at a time rather than jumping to the root.
 */
function collapse(trail: Crumb[]): Crumb[] {
  if (trail.length <= MAX_CRUMBS) return trail
  const deepestHidden = trail[trail.length - TAIL - 1]!
  return [
    trail[0]!,
    {
      key: "ellipsis",
      label: "…",
      title: deepestHidden.label,
      folder: deepestHidden.folder,
    },
    ...trail.slice(-TAIL),
  ]
}
