insert into abbreviation_system (short_name, title)
values ($1, $2)
on conflict (short_name) do update set
   title = excluded.title
returning id
