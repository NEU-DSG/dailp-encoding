-- Add a new key date to the database
insert into key_date (id, name)
values ($1::uuid, $2)
returning id;