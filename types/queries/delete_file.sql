-- Delete a file. $1 id
delete from files
where id = $1
returning id, folder_id, s3_url, name;
