insert into iiif_source (title, base_url)
values ($1, $2)
on conflict (base_url) do update
set title = excluded.title
returning id
