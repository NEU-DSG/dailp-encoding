-- Move a folder under a new parent. $1 id, $2 new parent_id (null = root).
-- Descendants need no update: they point at this folder's id, which does not change.
update folders
set parent_id = $2
where id = $1
returning id, parent_id, name;
