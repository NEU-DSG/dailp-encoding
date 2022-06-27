insert into contributor (full_name)
values ($1)
on conflict (full_name) do update set
full_name = excluded.full_name
