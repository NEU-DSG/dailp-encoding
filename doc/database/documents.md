# Documents

## `document_group`

| column  | type   | description                                                  |
| ------- | ------ | ------------------------------------------------------------ |
| `id`    | `uuid` | Primary key                                                  |
| `slug`  | `text` | URL slug, natural key                                        |
| `title` | `text` | Long title of the document set, e,g, "Dollie Duncan Letters" |

- Deleting a `document_group` auto-deletes all documents assigned to it.

## `document`

| column           | type                     | description                                  |
| ---------------- | ------------------------ | -------------------------------------------- |
| `id`             | `uuid`                   | Primary key                                  |
| `short_name`     | `text`                   | URL slug, natural key                        |
| `title`          | `text`                   | Full title of the document                   |
| `group_id`       | `uuid -> document_group` | ID of the `document_group` it belongs to     |
| `index_in_group` | `bigint`                 | Index of this document in its group          |
| `is_reference`   | `boolean`                | Is this a lexical source, like a dictionary? |
| `written_at`     | `date?`                  | When this was written or published           |
| `audio_slice_id` | `uuid? -> media_slice`   | Audio recording of the whole document        |

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
