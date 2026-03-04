# User

## `dailp_user`

Stores user account data. Supports two authentication modes controlled by the `AUTH_MODE` environment variable: AWS Cognito (`cognito`) or local accounts (`dailp`). When using Cognito, `id` corresponds to the Cognito `sub` claim; when using local accounts, `id` is generated at signup. The local account columns (`email`, `password_hash`, `email_verified`) are nullable to maintain compatibility with the Cognito auth mode.

| column           | type        | description                                                                |
| ---------------- | ----------- | -------------------------------------------------------------------------- |
| `id`             | `uuid`      | Primary key                                                                |
| `display_name`   | `text`      | How the user's name should be presented in the app                         |
| `created_at`     | `date`      | When the user record was created                                           |
| `avatar_url`     | `text?`     | Profile picture URL                                                        |
| `bio`            | `text?`     | User biography                                                             |
| `organization`   | `text?`     | User's organization                                                        |
| `location`       | `text?`     | User's location                                                            |
| `role`           | `user_role` | User's role, defaults to `Readers`                                         |
| `email`          | `text?`     | Email address (local accounts only, unique)                                |
| `password_hash`  | `text?`     | Argon2 password hash (local accounts only)                                 |
| `email_verified` | `boolean?`  | Whether email has been verified (local accounts only), defaults to `false` |

## `user_role`

Enum type for user permissions.

- `Readers` (default) — read-only access
- `Contributors` — can add audio, comments, and some language data.
- `Editors` — can add and publicly display language data, audio, and comments.
- `Administrators` — full access

## `refresh_tokens`

Stores hashed refresh tokens for local account sessions. Each token has a 7-day expiry.

| column         | type                 | description                             |
| -------------- | -------------------- | --------------------------------------- |
| `id`           | `uuid`               | Primary key                             |
| `user_id`      | `uuid`               | User this token belongs to              |
| `token_hash`   | `text`               | SHA-256 hash of the refresh token       |
| `expires_at`   | `timestamptz`        | When the token expires                  |
| `created_at`   | `timestamptz`        | When the token was created              |
| `last_used_at` | `timestamptz?`       | Last time the token was used to refresh |
| `revoked`      | `boolean`            | Whether the token has been revoked      |

- Indexed on `user_id`, `token_hash`, `expires_at`.
- Deleting a user cascades to remove their refresh tokens.

## `password_reset_tokens`

Stores hashed 6-digit codes for password reset flows. Each code expires after 1 hour.

| column       | type                 | description                      |
| ------------ | -------------------- | -------------------------------- |
| `id`         | `uuid`               | Primary key                      |
| `user_id`    | `uuid`               | User requesting the reset        |
| `token_hash` | `text`               | SHA-256 hash of the 6-digit code |
| `expires_at` | `timestamptz`        | When the code expires            |
| `created_at` | `timestamptz`        | When the code was created        |
| `used`       | `boolean`            | Whether the code has been used   |

- Indexed on `user_id`, `token_hash`, `expires_at`.

## `email_verification_tokens`

Stores hashed 6-digit codes for email verification during signup. Each code expires after 24 hours.

| column       | type                 | description                      |
| ------------ | -------------------- | -------------------------------- |
| `id`         | `uuid`               | Primary key                      |
| `user_id`    | `uuid`               | User verifying their email       |
| `token_hash` | `text`               | SHA-256 hash of the 6-digit code |
| `expires_at` | `timestamptz`        | When the code expires            |
| `created_at` | `timestamptz`        | When the code was created        |
| `used`       | `boolean`            | Whether the code has been used   |

- Indexed on `user_id`, `token_hash`, `expires_at`.
