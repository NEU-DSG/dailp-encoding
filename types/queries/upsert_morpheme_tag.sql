insert into abstract_morpheme_tag (internal_gloss, description, linguistic_type)
values ($1, $2, $3)
on conflict (internal_gloss) do update
   set description = excluded.description,
       linguistic_type = excluded.linguistic_type
returning id
