# language table

Stores languages used in or associated with documents, along with their autonym and approval status.

| Column  | Type            | Nullable | Description                        |
| ------- | --------------- | -------- | ---------------------------------- |
| id      | uuid            | no       | Primary key                        |
| name    | text            | no       | Keyword text                       |
| autonym | text            | yes      | Name for language in that language |
| status  | approval_status | no       | Approval status of keyword         |
