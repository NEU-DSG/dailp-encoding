# Asset Library Image Tables

## `images`

An image in the shared asset library, pointing at an object uploaded to S3.
Editors browse these through the asset library and insert them into content pages.

| column        | type                   | description                                                                  |
| ------------- | ---------------------- | ---------------------------------------------------------------------------- |
| `id`          | `uuid`                 | Primary key                                                                  |
| `folder_id`   | `uuid? -> folders`     | Folder holding this image. `null` for an image at the root of the library    |
| `created_at`  | `timestamp`            | When this image was recorded                                                 |
| `deleted_at`  | `timestamp?`           | When this image was soft-deleted. `null` while it is live                    |
| `uploaded_by` | `uuid? -> dailp_user`  | Who uploaded it, if known. Set to `null` if that user is later deleted       |
| `filename`    | `text`                 | Display name. Ex: `homepage-banner.jpg`                                      |
| `mime_type`   | `text`                 | Media type of the underlying object. Ex: `image/png`                         |
| `size_bytes`  | `bigint`               | Size of the underlying object                                                |
| `width`       | `integer`              | Pixel width                                                                  |
| `height`      | `integer`              | Pixel height                                                                 |
| `alt_text`    | `text?`                | Alternative text describing the image, for screen readers                    |
| `caption`     | `text?`                | Caption displayed alongside the image                                        |
| `s3_url`      | `text`                 | URL the image's bytes are served from                                        |
| `scope`       | `image_scope`          | Where this image is meant to be used                                         |

## Why images have no path

Folders carry an [ltree `path`](./folders.md), but images deliberately do not.
ltree uses `.` as its label separator, so a filename like `banner.jpg` would parse as two labels rather than one.
An image is located by its folder's path plus its `filename`.

## `image_scope`

| type         | description                              |
| ------------ | ---------------------------------------- |
| `Site`       | Used anywhere on the site                |
| `Collection` | Belongs to a particular edited collection |

## Soft deletion

Like folders, images are never removed, only stamped with `deleted_at`.
Deleting a folder stamps every image inside it as well.

The listing queries return soft-deleted rows on purpose and leave filtering to their callers, so anything reading this table must exclude `deleted_at` rows itself.

## Indexes

| index                    | definition                                                                   | purpose                                                                          |
| ------------------------ | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `images_live_child_name` | `unique (folder_id, filename) where deleted_at is null and folder_id is not null` | No two live images share a filename within the same folder                   |
| `images_live_root_name`  | `unique (filename) where deleted_at is null and folder_id is null`           | The same rule for images at the root. Nulls are never equal in a unique index, so the root group needs its own index |

Soft-deleted rows fall outside both, so deleting an image frees its filename for reuse.

## `page_image_reference`

A join table recording that a content page refers to an image from the library.
Rows are uniquely identified by the combination of `page_id` and `image_id`.
Both foreign keys cascade on delete, so removing a page or hard-deleting an image drops the reference with it.

| column        | type                    | description                        |
| ------------- | ----------------------- | ---------------------------------- |
| `page_id`     | `uuid -> page (page_id)` | Page that refers to the image      |
| `image_id`    | `uuid -> images`        | Image being referred to            |
| `inserted_at` | `timestamp`             | When the reference was recorded    |

## Related

- [folders](./folders.md): the tree these images are organised into
