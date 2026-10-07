-- All images directly inside folder $1, including soft-deleted ones - callers
-- filter out `deleted_at` rows in code. Pass null to list the root (`is not
-- distinct from` so a null $1 matches the root's null folder_id).
select id, folder_id, created_at, deleted_at, uploaded_by, filename,
       mime_type, size_bytes, width, height, alt_text, caption, s3_url,
       scope as "scope: ImageScope"
from images
where folder_id is not distinct from $1
order by filename;
