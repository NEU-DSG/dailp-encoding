-- Images anywhere in the library whose filename contains $1, case-insensitively.
-- Includes soft-deleted ones, like the other listings - callers filter out
-- `deleted_at` rows in code.
select id, folder_id, created_at, deleted_at, uploaded_by, filename,
       mime_type, size_bytes, width, height, alt_text, caption, s3_url,
       scope as "scope: ImageScope"
from images
where position(lower($1) in lower(filename)) > 0
order by filename;
