# spatial coverage table

Stores locations associated with documents, along with their approval status.

| Column | Type            | Nullable | Description                          |
|--------|-----------------|----------|--------------------------------------|
| id     | uuid            | no       | Primary key                          |
| name   | text            | no       | Keyword text                         |
| status | approval_status | no       | Approval status of spatial coverage  |