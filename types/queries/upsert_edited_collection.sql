insert into collection_chapter(title, section, slug)
values ($1, $2, $3)
on conflict (id) do update
set title = excluded.title,
section = excluded.section,
slug = excluded.slug