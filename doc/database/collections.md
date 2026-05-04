# Edited Collection Tables

## `edited_collection`

A single edited collection, for example "Cherokees Writing the Keetoowah Way".

| column              | type      | description                                        |
|---------------------|-----------|----------------------------------------------------|
| `id`                | `uuid`    | Primary key                                        |
| `title`             | `text`    | Full title of the collection                       |
| `wordpress_menu_id` | `bigint?` | ID of WordPress menu for navigating the collection |
| `slug`              | `text`    | URL slug for the collection, like `"cwkw"`         |
| `description`       | `text`    | Description for the collection                     |
| `thumbnail_url`     | `text`    | Thumbnail url for the edited collection, from S3   |

## `collection_chapter`

A chapter within a collection which has an optional document associated with it, and body text that comes from a WordPress page.

| column            | type                 | description                                                                                                                                                                                                                 |
|-------------------|----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `id`              | `uuid`               | Primary key                                                                                                                                                                                                                 |
| `title`           | `text`               | Full title of the chapter                                                                                                                                                                                                   |
| `document_id`     | `uuid? -> document`  | Associated document embedded in this chapter                                                                                                                                                                                |
| `wordpress_id`    | `bigint?`            | ID of WordPress page with text of the chapter                                                                                                                                                                               |
| `index_in_parent` | `bigint`             | Order within the parent chapter or collection                                                                                                                                                                               |
| `chapter_path`    | `ltree`              | Hierarchical path which defines which collection this belongs to and what its parent chapters are, using their URL slugs. First segment is the collection slug, last segment is this chapter's slug. Ex: `cwkw.letters.dd5` |
| `slug`            | `text`               | Slug for this chapter, unique within the collection. Generated from `chapter_path`.                                                                                                                                         |
| `collection_slug` | `text`               | Slug of the collection this chapter lives in. Generated from `chapter_path`.                                                                                                                                                                                                                            |
| `section`         | `collection_section` | Which section of the collection this chapter lives in. Ex: `Intro` or `Body` or `Credit`                                                                                                                                                 |

## `collection_section`

| type      | description                                        |
|-----------|----------------------------------------------------|
|  `Intro`  | Introductory chapter                               |
|  `Body`   | Body chapter                                       |
| `Credit`  | Credit chapter                                     |


## `collection_chapter_attribution`

A [join table](https://learn.co/lessons/sql-join-tables-readme) defining how a particular person contributed to one chapter.
Rows are uniquely identified by the combination of `chapter_id` and `contributor_id`.

| column              | type                         | description                                     |
|---------------------|------------------------------|-------------------------------------------------|
| `chapter_id`        | `uuid -> collection_chapter` |                                                 |
| `contributor_id`    | `uuid -> contributor`        |                                                 |
| `contribution_role` | `text`                       | How did they contribute? Ex: `Author`, `Editor` |