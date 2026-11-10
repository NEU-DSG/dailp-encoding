-- Soft-deleted folders at the outermost layer of the trash: those whose parent is
-- the root or is still live. A folder inside another deleted folder is omitted,
-- because restoring the outermost folder restores everything inside it.
select id, parent_id, name, path::text as "path!", created_at, deleted_at
from folders f
where f.deleted_at is not null
  -- Past the retention period: gone from the trash even before it's purged.
  and f.deleted_at > now() - make_interval(days => $1::int)
  and not exists (
    select 1
    from folders parent
    where parent.id = f.parent_id and parent.deleted_at is not null
  )
order by name;
