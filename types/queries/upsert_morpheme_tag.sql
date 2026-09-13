insert into abstract_morpheme_tag (internal_gloss, linguistic_type, representation_system_type)
values ($1, $2, $3::representation_system_type)
on conflict (internal_gloss) do update set
linguistic_type = excluded.linguistic_type,
representation_system_type = excluded.representation_system_type
returning id