-- Insert a new language into the database
insert into language (id, name, status)
values ($1::uuid, $2, $3)
returning id;