# Documents

## `document_group`
| column  | type            | description                                                  |
|---------|-----------------|--------------------------------------------------------------|
| `id`    | `uuid` | Primary key                                                  |
| `slug`  | `text` | URL slug, natural key                                        |
| `title` | `text` | Long title of the document set, e,g, "Dollie Duncan Letters" |

- Deleting a `document_group` auto-deletes all documents assigned to it.

## `document`
| column           | type                     | description                                  |
|------------------|--------------------------|----------------------------------------------|
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
|---------------------|------------------------|----------------------------------------|
| `id`                | `uuid`                 | Primary key                            |
| `document_id`       | `uuid -> document`     | The document this page lives in        |
| `index_in_document` | `bigint`               | Index of this page within the document |
| `iiif_source_id`    | `uuid? -> iiif_source` | IIIF server that holds the page image  |
| `iiif_oid`          | `text?`                | IIIF object identifier                 |

- If `iiif_source_id` is non-null, then `iiif_oid` cannot be null
- There can only be one page per document with a particular `index_in_document` value
