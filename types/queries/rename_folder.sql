-- Rename a folder. $1 id, $2 new name
update folders
set name = $2
where id = $1
returning id, parent_id, name;
