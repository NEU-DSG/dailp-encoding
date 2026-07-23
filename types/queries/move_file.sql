-- Move a file into another folder. $1 id, $2 new folder_id
update files
set folder_id = $2
where id = $1
returning id, folder_id, s3_url, name;
