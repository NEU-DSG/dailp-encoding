-- Move a folder under a new parent. $1 id, $2 new parent_id (null = root).
-- `parent_id` changes on the folder itself, and every path in the subtree is
-- rebuilt on the destination's prefix. The cycle guard runs before this, so the
-- destination is never inside the subtree being moved.
with target as (
  select
    f.path as old_path,
    case
      when $2::uuid is null then subpath(f.path, nlevel(f.path) - 1)
      else (select p.path from folders p where p.id = $2)
             || subpath(f.path, nlevel(f.path) - 1)
    end as new_path
  from folders f
  where f.id = $1
),
updated as (
  update folders f
  set parent_id = case when f.id = $1 then $2 else f.parent_id end,
      -- `<@` includes the folder itself, where there is nothing below
      -- `old_path` to keep, and `subpath` rejects an offset at the end.
      path = case
        when f.path = t.old_path then t.new_path
        else t.new_path || subpath(f.path, nlevel(t.old_path))
      end
  from target t
  where f.path <@ t.old_path
  returning f.*
)
select id as "id!", parent_id, name as "name!", path::text as "path!",
       created_at as "created_at!", deleted_at, size_bytes as "size_bytes!"
from updated
where id = $1;
