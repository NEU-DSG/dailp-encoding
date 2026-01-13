-- Add a new keyword to the database
insert into keyword (id, name, status)
values ($1::uuid, $2, $3)
returning id;