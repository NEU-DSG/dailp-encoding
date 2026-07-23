-- Delete a folder. $1 id
-- Fails if the folder still holds subfolders or files: both foreign keys restrict
-- by default, so contents must be moved or deleted first.
delete from folders
where id = $1
returning id, parent_id, name;
