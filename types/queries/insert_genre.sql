insert into genre (id, name, status)
values ($1::uuid, $2, $3)
returning id;