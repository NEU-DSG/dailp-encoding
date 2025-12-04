insert into collection_chapter(id, title, section, index_in_parent)
values ($1::uuid, $2, $3::collection_section, $4)
on conflict (id) do update
set title = excluded.title,
section = excluded.section,
index_in_parent = excluded.index_in_parent