insert into abstract_morpheme_tag (title, description, linguistic_type)
values ($1, $2, $3)
returning id
