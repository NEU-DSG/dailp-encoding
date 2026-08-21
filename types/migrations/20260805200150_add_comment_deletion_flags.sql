-- Add column for soft deletion of comments.

alter table comment
  add column deleted_at timestamp;