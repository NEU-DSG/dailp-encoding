# Documents

## `document_group`

| column  | type   | description                                                  |
| ------- | ------ | ------------------------------------------------------------ |
| `id`    | `uuid` | Primary key                                                  |
| `slug`  | `text` | URL slug, natural key                                        |
| `title` | `text` | Long title of the document set, e,g, "Dollie Duncan Letters" |

- Deleting a `document_group` auto-deletes all documents assigned to it.

## `document`

| column                               | type                     | description                                                            |
| ------------------------------------ | ------------------------ | ---------------------------------------------------------------------- |
| `id`                                 | `uuid`                   | Primary key                                                            |
| `short_name`                         | `text`                   | URL slug, natural key                                                  |
| `title`                              | `text`                   | Full title of the document                                             |
| `group_id`                           | `uuid -> document_group` | ID of the `document_group` it belongs to                               |
| `index_in_group`                     | `bigint`                 | Index of this document in its group                                    |
| `is_reference`                       | `boolean`                | Is this a lexical source, like a dictionary?                           |
| `written_at`                         | `date?`                  | When this was written or published                                     |
| `audio_slice_id`                     | `uuid? -> media_slice`   | Audio recording of the whole document, as ingested from GoogleSheets.  |
| `include_audio_in_edited_collection` | `boolean`                | True if ingested audio should be shown to readers. Defaults to `true`. |
| `audio_edited_by`                    | `uuid? -> User`          | Last Editor to decide if ingested audio should be shown to readers.    |

- Deleting a `document` auto-deletes all `document_page` rows within it.

## `document_page`

| column              | type                   | description                            |
| ------------------- | ---------------------- | -------------------------------------- |
| `id`                | `uuid`                 | Primary key                            |
| `document_id`       | `uuid -> document`     | The document this page lives in        |
| `index_in_document` | `bigint`               | Index of this page within the document |
| `iiif_source_id`    | `uuid? -> iiif_source` | IIIF server that holds the page image  |
| `iiif_oid`          | `text?`                | IIIF object identifier                 |

- If `iiif_source_id` is non-null, then `iiif_oid` cannot be null
- There can only be one page per document with a particular `index_in_document` value

## `character_transcription`

One written character on a page, which may have multiple potential transcriptions.

| column                    | type                    | description                                                    |
| ------------------------- | ----------------------- | -------------------------------------------------------------- |
| `id`                      | `uuid`                  | Primary key                                                    |
| `page_id`                 | `uuid -> document_page` | The page this character is on                                  |
| `index_in_page`           | `bigint`                | Index of the character in the page                             |
| `possible_transcriptions` | `text[]`                | Zero or more transcriptions which should be one character each |
| `image_area`              | `box?`                  | Bounding box of the page image corresponding to this character |

## `paragraph`

| column                | type                    | description                            |
| --------------------- | ----------------------- | -------------------------------------- |
| `id`                  | `uuid`                  | Primary key                            |
| `page_id`             | `uuid -> document_page` | Page this paragraph lives on           |
| `character_range`     | `int8range`             | Which characters make up the paragraph |
| `english_translation` | `text`                  | Free translation without formatting    |

## `document_source`

**Currently unused table!**

Original source for documents, which are usually archives or libraries which house the physical materials or at least images of them.

| column | type   | description                           |
| ------ | ------ | ------------------------------------- |
| `id`   | `uuid` | Primary key                           |
| `name` | `text` | Name of the source used for citations |
| `url`  | `text` | Homepage URL                          |

## `document_source_citation`

**Currently unused table!**

This bridge table allows a many to many relationship between `document` and `document_source`, in case a document has components that come from multiple sources.

| column        | type   | description         |
| ------------- | ------ | ------------------- |
| `document_id` | `uuid` | Document referenced |
| `source_id`   | `uuid` | Source to cite      |

## `user_bookmarked_document`

This join table stores bookmarked documents. It stores them as the document id, user id, and
the bookmarked date

| column          | type   | description         |
| --------------- | ------ | ------------------- |
| `document_id`   | `uuid` | Document referenced |
| `user_id`       | `uuid` | User referenced     |
| `bookmarked_on` | `date` | Date bookmarked     |

## `document_user_media`

A join table linking user audio contributions to documents. This is technically implemented as a many-to-many relationship, and is indexed on both keys, with a compound unique constraint. Additions should be written as upserts. Compare to `word_user_media`, described in `words.md`.

| column                         | type                  | description                                                                                                |
| ------------------------------ | --------------------- | ---------------------------------------------------------------------------------------------------------- |
| `document_id`                  | `uuid -> document`    | Document that is assocated with media slice. Ie. which document is read aloud in the recording.            |
| `media_slice_id`               | `uuid -> media_slice` | Media slice that is assocated with the document.                                                           |
| `include_in_edited_collection` | `boolean`             | Should audio be revealed to readers? Defaults to `false`.                                                  |
| `edited_by`                    | `uuid? -> dailp_user` | Last Editor to decide if audio should be included in edited collection, ie. revealed to un-authed Readers. |
