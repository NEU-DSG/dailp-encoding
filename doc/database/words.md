# Words

## `word`

| column                               | type                     | description                                                                                         |
| ------------------------------------ | ------------------------ | --------------------------------------------------------------------------------------------------- |
| `id`                                 | `uuid`                   | Primary key                                                                                         |                         |
| `english_gloss`                      | `text?`                  | English translation                                                                                 |
| `recorded_at`                        | `date?`                  | When this word was written, only specified if it differs from when the document overall was written |
| `commentary`                         | `text?`                  | Linguistic or historical commentary supplied by an annotator                                        |
| `audio_slice_id`                     | `uuid? -> media_slice`   | Audio recording of the word read aloud, as ingested from Google Sheets.                             |
| `include_audio_in_edited_collection` | `boolean`                | True if ingested audio should be shown to readers. Defaults to `true`.                              |
| `audio_edited_by`                    | `uuid? -> User`          | Last Editor to decide if ingested audio should be shown to readers.                                 |
| `document_id`                        | `uuid -> document`       | Document the word is in                                                                             |
| `page_number`                        | `text?`                  | Page number, only supplied for documents like dictionaries that may not have `document_page` rows   |
| `index_in_document`                  | `bigint`                 | Position of the word in the whole document                                                          |
| `page_id`                            | `uuid? -> document_page` | Physical page containing this word                                                                  |
| `character_range`                    | `int8range?`             | Order of words in a paragraph is determined by character indices                                    |

- One of `page_id` or `character_range` must be supplied

## `word_user_media`

A join table linking user audio contributions to words in documents. This is a many-to-many relationship, so should be indexed on both keys, with a compound unique constraint. Ie. you cannot link the same audio to the same word multiple times. Additions should be written as upserts. Compare to `document_user_media`, described in `documents.md`.

| column                         | type                  | description                                                             |
| ------------------------------ | --------------------- | ----------------------------------------------------------------------- |
| `word_id`                      | `uuid -> word`        | Word that is assocated with media slice.                                |
| `media_slice_id`               | `uuid -> media_slice` | Media slice that is assocated with word.                                |
| `include_in_edited_collection` | `boolean`             | Should audio be revealed to readers? Defaults to `false`.               |
| `edited_by`                    | `uuid? -> dailp_user` | Last Editor to decide if audio should be included in edited collection. |

## `word_segment`

A part of a word, also known as a morpheme within a morphemic segmentation.
Generally used to display interlinear glossed text.

Word segments are unique on the combination of `word_id` and `index_in_word`.

| column          | type                      | description                                                                                                                                   |
| --------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`            | `uuid`                    | Primary key                                                                                                                                   |
| `word_id`       | `uuid -> word`            | Word this is a part of                                                                                                                        |
| `index_in_word` | `bigint`                  | Position within the word                                                                                                                      |
| `morpheme`      | `text`                    | Underlying phonemic representation of the morpheme                                                                                            |
| `gloss_id`      | `uuid? -> morpheme_gloss` | English gloss which may be shared with other word segments                                                                                    |
| `role`          | `word_segment_role`       | Role of the segment within the word, either `Morpheme`, `Clitic`, or `Modifier`. This usually determines the separator character used in IGT. |

## `morpheme_gloss`

Used for glossing related morphemes within a document.
So within `WJ46`, if I want to gloss two words as "walk" because they are the
same lexical unit, then both words use the same `morpheme_gloss` row.
For example, one might be `WJ46:walk` which displays as "walk" within that document.

Each value of `gloss` is unique within its parent document.

| column          | type                             | description                                           |
| --------------- | -------------------------------- | ----------------------------------------------------- |
| `id`            | `uuid`                           | Primary key                                           |
| `document_id`   | `uuid? -> document`              | If non-null, this gloss is scoped within the document |
| `gloss`         | `text`                           | English gloss used in linguistic analysis             |
| `example_shape` | `text?`                          | Optional romanized example of the underlying morpheme |
| `tag_id`        | `uuid? -> abstract_morpheme_tag` | Optional associated functional morpheme tag           |

## `abbreviation_system`

A linguistic system for displaying morphemic segmentations of each word.
Each system has a different mapping of internal morpheme glosses to display morphemes.

| column       | type   | description                                                                                      |
| ------------ | ------ | ------------------------------------------------------------------------------------------------ |
| `id`         | `uuid` | Primary key                                                                                      |
| `short_name` | `text` | Natural key, like "CRG". Once we have live data, either remove this field or make it non-unique. |
| `title`      | `text` | Full title of the system, like "Cherokee Reference Grammar"                                      |

## `abstract_morpheme_tag`

| column            | type    | description                                              |
| ----------------- | ------- | -------------------------------------------------------- |
| `id`              | `uuid`  | Primary key                                              |
| `internal_gloss`  | `text`  | Abbreviation used in morphemic segmentations, like `3PL` |
| `linguistic_type` | `text?` | For example "pronominal orefix" or "modal suffix"        |

## `morpheme_tag`

| column          | type                          | description                                                                                                                                 |
| --------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`            | `uuid`                        | Primary key                                                                                                                                 |
| `system_id`     | `uuid -> abbreviation_system` |                                                                                                                                             |
| `abtract_ids`   | `uuid[]`                      | Internal tags making up this output tag                                                                                                     |
| `gloss`         | `text`                        | Abbreviation used in segmentations like `PFT`                                                                                               |
| `title`         | `text`                        | Full name like `Perfective Aspect`                                                                                                          |
| `description`   | `text?`                       | For example "3rd person plural"                                                                                                             |
| `role_override` | `word_segment_role?`          | Overrides the role of all uses of this tag. Useful for abbreviation systems which require certain morphemes to take on the `Modifier` role. |
