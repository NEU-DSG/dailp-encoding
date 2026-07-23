-- Create a file. $1 folder_id, $2 name, $3 s3_url
insert into files (id, folder_id, name, s3_url)
values (uuid_generate_v4(), $1, $2, $3)
returning id, folder_id, s3_url, name;
