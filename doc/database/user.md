# User

## `user`

Metadata assocated with a user. `user.id` on this table is equal to `sub` in
AWS. Users are not to be confused with `contributor` entires, which are imported
from Google Sheets.

| column         | type    | description                                        |
| -------------- | ------- | -------------------------------------------------- |
| `id`           | `uuid`  | Primary key, AWS Cognito `sub` claim               |
| `display_name` | `text`  | How the user's name should be presented in the app |
| `created_at`   | `date`  | When the user record was created                   |
| `archived_at`  | `date?` | When the user record was archived, if ever         |
