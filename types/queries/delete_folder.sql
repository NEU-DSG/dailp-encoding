-- Soft-delete a folder: stamp deleted_at rather than removing the row. $1 id
update folders
set deleted_at = now()
where id = $1
returning id, parent_id, name, path::text as "path!", created_at, deleted_at,
          size_bytes;
