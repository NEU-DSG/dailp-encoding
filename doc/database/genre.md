# genre table

Stores genres that help us understand the social practice surrounding a document, along with their approval status.

| Column | Type            | Nullable | Description                |
|--------|-----------------|----------|----------------------------|
| id     | uuid            | no       | Primary key                |
| name   | text            | no       | Keyword text               |
| status | approval_status | no       | Approval status of genre   |