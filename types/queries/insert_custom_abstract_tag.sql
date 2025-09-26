insert into abstract_morpheme_tag (internal_gloss, linguistic_type)
values ($1, $2)
on conflict (internal_gloss) do update set
linguistic_type = excluded.linguistic_type
returning id