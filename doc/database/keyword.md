# keyword table

Stores keywords used in documents, along with their approval status.

| Column | Type            | Nullable | Description                 |
|--------|-----------------|----------|-----------------------------|
| id     | uuid            | no       | Primary key                 |
| name   | text            | no       | Keyword text                |
| status | approval_status | no       | Approval status of keyword  |