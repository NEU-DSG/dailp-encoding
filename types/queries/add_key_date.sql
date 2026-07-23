-- Add a new key date
insert into key_date (name)
values ($1)
returning id;