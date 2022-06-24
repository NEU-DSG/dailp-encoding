insert into morpheme_tag (system_id, abstract_ids, gloss, title)
values ($1, $2, $3, $4)
on conflict (system_id, abstract_ids) do update set
gloss = excluded.gloss
