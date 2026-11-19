# subject heading table

Stores terms that reflect Indigenous knowledge practices, along with their approval status.

| Column | Type            | Nullable | Description                         |
|--------|-----------------|----------|-------------------------------------|
| id     | uuid            | no       | Primary key                         |
| name   | text            | no       | Subject heading text                |
| status | approval_status | no       | Approval status of subject heading  |