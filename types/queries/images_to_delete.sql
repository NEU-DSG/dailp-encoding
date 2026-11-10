-- Live images that deleting folders $1 and images $2 would send to the trash:
-- the images themselves, and every live image anywhere inside the folders.
--
-- The subtree follows `parent_id` because a folder in the trash can have the same
-- path as a live one without being inside it, which `<@` can't tell apart.
with recursive subtree as (
  select id from folders where id = any($1::uuid[]) and deleted_at is null
  union
  select child.id
  from folders child
  join subtree on child.parent_id = subtree.id
  where child.deleted_at is null
)
select id, folder_id, created_at, deleted_at, uploaded_by, filename,
       mime_type, size_bytes, width, height, s3_url,
       scope as "scope: ImageScope"
from images
where deleted_at is null
  and (id = any($2::uuid[]) or folder_id in (select id from subtree))
order by filename;
