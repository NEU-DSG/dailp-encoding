import type * as Dailp from "src/graphql/dailp"

// How the browser lays out a folder's contents.
export type ViewMode = "grid" | "list"

// Folders and images render as separate sections, but a selection can hold
// both, so each item carries a discriminant.
export type SelectedItem =
  | { kind: "folder"; folder: Dailp.FolderFieldsFragment }
  | { kind: "image"; image: Dailp.ImageFieldsFragment }
