-- Rename a file. $1 id, $2 new name
update files
set name = $2
where id = $1
returning id, folder_id, s3_url, name;
