-- One image by id, live or soft-deleted.
select id, folder_id, created_at, deleted_at, uploaded_by, filename,
       mime_type, size_bytes, width, height, alt_text, caption, s3_url,
       scope as "scope: ImageScope"
from images
where id = $1;
