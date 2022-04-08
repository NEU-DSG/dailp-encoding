-- Insert a collection with a certain slug.
insert into document_group (slug, title)
values ($1, $2)
on conflict (slug)
  do update set
    title = excluded.title
  returning id
