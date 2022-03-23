insert into abstract_morpheme_tag (internal_gloss, title, description, linguistic_type)
values ($1, $2, $3, $4)
on conflict (internal_gloss) do update
   set title = excluded.title,
       description = excluded.description,
       linguistic_type = excluded.linguistic_type
returning id
