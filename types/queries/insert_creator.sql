-- Insert new creator or update name if creator with same ID exists
insert into creator (id, name)
values ($1::uuid, $2);