-- Add a new associated person to the database
insert into associated_person (id, name)
values ($1::uuid, $2)
on conflict (name) do update set name = excluded.name
returning id;