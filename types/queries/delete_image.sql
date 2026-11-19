-- Soft-delete an image: stamp deleted_at rather than removing the row. $1 id
update images
set deleted_at = now()
where id = $1
returning id, folder_id, created_at, deleted_at, uploaded_by, filename,
          mime_type, size_bytes, width, height, alt_text, caption, s3_url,
          scope as "scope: ImageScope";
