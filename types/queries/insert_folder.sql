-- Create a folder. $1 parent_id (null = root), $2 name, $3 slug label.
-- The path is the parent's path plus this folder's slug; a root folder's path
-- is just its own label. deleted_at is left null: a new row is not deleted.
insert into folders (parent_id, name, path)
values (
  $1,
  $2,
  case
    when $1::uuid is null then $3::ltree
    else (select f.path from folders f where f.id = $1) || $3::ltree
  end
)
returning id, parent_id, name, path::text as "path!", created_at, deleted_at,
          size_bytes;
