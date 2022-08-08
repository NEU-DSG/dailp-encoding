# Read Me

The docs here describe every single one of our database tables and columns.
If you write a database schema migration, you should change the corresponding docs in this folder to match the new shape of the database.
If you work with database tables that aren't sufficiently documented here, please add!

## Abbreviations in this Folder

Most of our columns are `not null`, which is long to write so we introduced shorthand for describing database columns.

| Column type shorthand       | SQL                                 | Rust           |
|-----------------------------|-------------------------------------|----------------|
| `type`                      | `type not null`                     | `Type`         |
| `type?`                     | `type` (nullable)                   | `Option<Type>` |
| `uuid -> other_table`       | `uuid references other_table (id)`  |                |
| `type -> other_table (key)` | `type references other_table (key)` |                |

## Common SQL to Rust type mappings

| SQL         | Rust               |
|-------------|--------------------|
| `bigint`    | `i64`              |
| `boolean`   | `bool`             |
| `text`      | `String` or `&str` |
| `uuid`      | `uuid::Uuid`       |
| `date`      | `dailp::Date`      |
| `int8range` | `sqlx::PgRange`    |
| `type[]`    | `Vec<T>` or `&[T]` |

## Table of Contents
- [documents](./documents.md): Annotated documents tables
- [collections](./collections.md): Edited collections tables
