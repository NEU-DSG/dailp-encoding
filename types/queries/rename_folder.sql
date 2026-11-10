-- Rename a folder. $1 id, $2 new name, $3 new slug label.
-- The folder's own path label changes, so every descendant's path is rebuilt on
-- the new prefix: `subpath(path, nlevel(old))` is the part below the renamed
-- folder, which is re-attached to the new prefix.
--
-- The subtree follows `parent_id` because a folder in the trash can have the same
-- path as a live one without being inside it, which `<@` can't tell apart.
with recursive subtree as (
  select id from folders where id = $1
  union all
  select child.id
  from folders child
  join subtree on child.parent_id = subtree.id
),
target as (
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
      -- The folder itself has nothing below `old_path` to keep, and `subpath`
      -- rejects an offset at the end.
      path = case
        when f.path = t.old_path then t.new_path
        else t.new_path || subpath(f.path, nlevel(t.old_path))
      end
  from target t
  where f.id in (select id from subtree)
  returning f.*
)
select id as "id!", parent_id, name as "name!", path::text as "path!",
       created_at as "created_at!", deleted_at
from updated
where id = $1;
