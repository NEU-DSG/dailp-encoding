-- Create a folder. $1 parent_id (null = root), $2 name
insert into folders (id, parent_id, name)
values (uuid_generate_v4(), $1, $2)
returning id, parent_id, name;
