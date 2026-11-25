-- Rename an image. $1 id, $2 new filename
update images
set filename = $2
where id = $1
returning id, folder_id, created_at, deleted_at, uploaded_by, filename,
          mime_type, size_bytes, width, height, alt_text, caption, s3_url,
          scope as "scope: ImageScope";
