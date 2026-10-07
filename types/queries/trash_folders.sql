-- Soft-deleted folders at the outermost layer of the trash: those whose parent is
-- the root or is still live. A folder inside another deleted folder is omitted,
-- because restoring the outermost folder restores everything inside it.
select id, parent_id, name, path::text as "path!", created_at, deleted_at,
       size_bytes
from folders f
where f.deleted_at is not null
  and not exists (
    select 1
    from folders parent
    where parent.id = f.parent_id and parent.deleted_at is not null
  )
order by name;
