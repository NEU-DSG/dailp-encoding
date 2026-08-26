# Asset Library Folder Tables

## `folders`

A folder in the shared asset library, the browsable collection of images that editors pull from when writing content pages.
Folders form a tree; a folder with no parent sits at the root of the library.

| column       | type               | description                                                                                     |
| ------------ | ------------------ | ----------------------------------------------------------------------------------------------- |
| `id`         | `uuid`             | Primary key                                                                                     |
| `name`       | `text`             | Display name, free text. Ex: `Partner Logos`                                                    |
| `parent_id`  | `uuid? -> folders` | Folder this one sits inside. `null` for a folder at the root of the library                     |
| `path`       | `ltree`            | Slugified path from the root, one label per ancestor. Ex: `partner_logos.archived`              |
| `created_at` | `timestamp`        | When this folder was created                                                                    |
| `deleted_at` | `timestamp?`       | When this folder was soft-deleted. `null` while it is live                                      |
| `size_bytes` | `bigint`           | Total size of this folder's contents.                                                           |

## Names and paths

`name` is free text meant for display, while `path` is built from `slugify_ltree(name)` for the folder and each of its ancestors.
This is the same split `collection_chapter` uses between `title` and `chapter_path`, and it exists because ltree labels only permit `[A-Za-z0-9_]` - so `Partner Logos` is stored as the label `partner_logos`.

One consequence worth knowing: two different names that slugify to the same label (`Partner Logos` and `Partner-Logos`) produce the same path and therefore collide.
That keeps paths unambiguous, but it means a uniqueness error can be reported for names that do not look identical.

`path` is how a folder is addressed from outside the database - the `folderContents` and `folderBreadcrumbs` GraphQL queries both take a path rather than an id, so the library root can be requested explicitly (as the empty string) instead of as a missing id.

## `path` and `parent_id` describe the same tree

Both columns encode the folder hierarchy. They serve different purposes:

- `parent_id` gives referential integrity and cheap listing of a folder's direct children.
- `path` gives addressing, ancestor and descendant tests (`@>` and `<@`), and breadcrumbs without recursion.

Because the tree is stored twice, the two can (in principle) disagree. They are always written in the same statement - `insert_folder.sql`, `rename_folder.sql`, and `move_folder.sql` each set both - so nothing in the application can update one without the other. A rename or move rewrites the path of every folder in the subtree.

## Soft deletion

Folders are never removed, only stamped with `deleted_at`, so the row survives as a record of what existed.
Deleting a folder stamps its whole subtree, including the images inside it.

The listing queries deliberately return soft-deleted rows and leave the filtering to their callers, so anything reading these tables must exclude `deleted_at` rows itself.

## Indexes

| index               | definition                                       | purpose                                                                                                                |
| ------------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `folders_live_path` | `unique (path) where deleted_at is null`         | A live folder's path is unique. Since a path is its parent's path plus its own slug, this also enforces unique sibling names. Soft-deleted rows drop out, so a deleted folder frees its path for reuse |
| `folders_path_gist` | `gist (path)`                                    | Ancestor and descendant lookups (`@>`, `<@`)                                                                           |

## Related

- [images](./images.md): the images held in these folders
