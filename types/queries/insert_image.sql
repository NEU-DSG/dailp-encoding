-- Record an image that has already been uploaded to S3.
-- $1 folder_id (null = root), $2 filename, $3 mime_type, $4 size_bytes,
-- $5 width, $6 height, $7 alt_text, $8 caption, $9 s3_url, $10 scope,
-- $11 uploaded_by (null when the uploader is not known).
-- deleted_at is left null: a new row is, by definition, not deleted.
insert into images (
  folder_id, filename, mime_type, size_bytes, width, height,
  alt_text, caption, s3_url, scope, uploaded_by
)
values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
returning id, folder_id, created_at, deleted_at, uploaded_by, filename,
          mime_type, size_bytes, width, height, alt_text, caption, s3_url,
          scope as "scope: ImageScope";
