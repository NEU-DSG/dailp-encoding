-- Add a new creator
insert into creator (name)
values ($1)
returning id;