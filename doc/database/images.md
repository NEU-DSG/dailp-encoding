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

## `image_variant`

Resized copies of an image, so a page can serve the smallest file a device actually needs.
The original is not stored here: it already sits on `images`, and it is always the largest candidate in the set.

| column      | type             | description                           |
| ----------- | ---------------- | ------------------------------------- |
| `image_id`  | `uuid -> images` | Image this is a copy of               |
| `width`     | `integer`        | Pixel width of this copy              |
| `height`    | `integer`        | Pixel height of this copy             |
| `s3_url`    | `text`           | URL this copy's bytes are served from |
| `mime_type` | `text`           | Media type of this copy               |

Rows are uniquely identified by the combination of `image_id` and `width`, so an image cannot hold two copies at the same width.
The foreign key cascades on delete, so hard-deleting an image drops its copies with it.
Copies carry no `deleted_at` of their own and follow the soft-deletion state of the image they belong to.

## Which images get copies

Copies are generated in the browser during upload, at 400, 800 and 1600 pixels wide, and only at widths narrower than the image itself.

Two kinds of image get none:

- **Images narrower than 400px**, already smaller than the smallest copy would be.
- **GIFs**, which are never re-encoded at all.

No image is guaranteed to have copies, so anything reading these rows must handle an empty set by falling back to `images.s3_url`.

## How GIFs are handled

A browser canvas cannot write GIF.
Asked for one, `toBlob` silently substitutes PNG, and a canvas round-trip keeps only the frame it drew, flattening any animation.
There is no way to resize a GIF, strip anything from it, or copy it and have the result still be a GIF.

So a GIF takes one of two paths, whether or not it animates:

| uploaded       | outcome                                                            |
| -------------- | ------------------------------------------------------------------ |
| Over 4000px    | Rejected, asking the editor to resize it and upload again          |
| Within the cap | Stored byte-identical to the file the editor chose, with no copies |

Rejecting rather than converting is deliberate.
Converting would silently turn an editor's `logo.gif` into a `logo.png`, and for an animated GIF it would destroy the animation outright. Using silently converted PNG copies would also cause the GIFs to be still which could confuse users.
Nothing is lost by never re-encoding: GIF has no EXIF block to strip, only comment and application extensions.

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
