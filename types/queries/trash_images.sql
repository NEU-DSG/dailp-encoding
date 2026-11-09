-- Soft-deleted images at the outermost layer of the trash: those whose folder is
-- the root or is still live. An image inside a deleted folder is omitted, because
-- restoring that folder restores everything inside it.
select id, folder_id, created_at, deleted_at, uploaded_by, filename,
       mime_type, size_bytes, width, height, alt_text, caption, s3_url,
       scope as "scope: ImageScope"
from images i
where i.deleted_at is not null
  and not exists (
    select 1
    from folders parent
    where parent.id = i.folder_id and parent.deleted_at is not null
  )
order by filename;
