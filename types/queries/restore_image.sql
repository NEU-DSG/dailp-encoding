-- Take an image out of the trash. $1 id, $2 retention in days: past it, the
-- image can't come back, and no row is returned.
update images
set deleted_at = null
where id = $1
  and deleted_at > now() - make_interval(days => $2::int)
returning id, folder_id, created_at, deleted_at, uploaded_by, filename,
          mime_type, size_bytes, width, height, s3_url,
          scope as "scope: ImageScope";
