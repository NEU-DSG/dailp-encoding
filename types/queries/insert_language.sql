insert into language (id, name, status)
values ($1::uuid, $2, $3)
on conflict (id) do nothing;