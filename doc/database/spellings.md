# Spellings

Spellings replace the old `source_text` and `simple_phonetics` columns on `word` with a flexible, extensible system. Each word can have multiple spellings across different spelling systems.

## `spelling_system`

A named system for spelling words. Admins can add new systems as needed.

| column | type   | description                                                    |
| ------ | ------ | -------------------------------------------------------------- |
| `id`   | `uuid` | Primary key                                                    |
| `name` | `text` | Unique display name of the system, e.g. "Source", "Simple Phonetics" |

Seeded values: `Source`, `Simple Phonetics`.

## `word_spelling`

A join table linking words to their spelling values within each spelling system. The composite primary key `(word_id, spelling_system)` ensures each word has at most one spelling per system.

| column            | type                       | description                          |
| ----------------- | -------------------------- | ------------------------------------ |
| `word_id`         | `uuid -> word`             | The word this spelling belongs to    |
| `spelling_system` | `uuid -> spelling_system`  | The spelling system for this value   |
| `value`           | `text`                     | The spelling text                    |
