insert into morpheme_tag (system_id, abstract_ids, gloss)
values ($1, $2, $3)
on conflict (system_id, abstract_ids) do update set
   gloss = excluded.gloss
