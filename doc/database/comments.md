# Comments

## `comment`

A single comment left by a user on some piece of DAILP content.

| column         | type                    | description                                                                               |
| -------------- | ----------------------- | ----------------------------------------------------------------------------------------- |
| `id`           | `uuid`                  | Primary key                                                                               |
| `posted_at`    | `timestamp`             | When the comment was posted                                                               |
| `posted_by`    | `uuid -> dailp_user`    | User who posted the comment                                                               |
| `text_content` | `text`                  | The actual content of the comment                                                         |
| `comment_type` | `comment_type_enum`     | A tag specifying the "kind" of comment, ie. a "Story" as opposed to a "Correction"        |
| `parent_id`    | `uuid -> [parent_type]` | The _uuid of_ the object that this comment is regarding, ie. a specific word or paragraph |
| `parent_type`  | `comment_parent_type`   | The _kind of_ object that this comment is regarding, ie. a word or paragraph              |

- Because polymorphism and foreign key constraints are hard, _there is no fkey constraint on `parent_id`_.
- Deleting a `dailp_user` deletes all comments made by that user!
