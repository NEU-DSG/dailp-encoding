-- Rename a folder. $1 id, $2 new name, $3 new slug label.
-- The folder's own path label changes, so every descendant's path is rebuilt on
-- the new prefix: `subpath(path, nlevel(old))` is the part below the renamed
-- folder, which is re-attached to the new prefix.
with target as (
  select
    path as old_path,
    case
      when nlevel(path) = 1 then $3::ltree
      else subpath(path, 0, nlevel(path) - 1) || $3::ltree
    end as new_path
  from folders
  where id = $1
),
updated as (
  update folders f
  set name = case when f.id = $1 then $2 else f.name end,
      path = t.new_path || subpath(f.path, nlevel(t.old_path))
  from target t
  where f.path <@ t.old_path
  returning f.*
)
select id as "id!", parent_id, name as "name!", path::text as "path!",
       created_at as "created_at!", deleted_at, size_bytes as "size_bytes!"
from updated
where id = $1;
