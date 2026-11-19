# format table

Stores formats that allow us to trace what the original artifact was, along with their approval status.

| Column | Type            | Nullable | Description                 |
|--------|-----------------|----------|-----------------------------|
| id     | uuid            | no       | Primary key                 |
| name   | text            | no       | Keyword text                |
| status | approval_status | no       | Approval status of format   |