import type * as Dailp from "src/graphql/dailp"

// How the browser lays out a folder's contents.
export type ViewMode = "grid" | "list"

/**
 * The item highlighted in the browser, which drives the side panel.
 *
 * Folders and images are rendered as separate sections, so the lists
 * themselves need no tagging -- but a single selection can be either type, so
 * it carries a discriminant.
 */
export type Selection =
  | { kind: "folder"; folder: Dailp.FolderFieldsFragment }
  | { kind: "image"; image: Dailp.ImageFieldsFragment }
