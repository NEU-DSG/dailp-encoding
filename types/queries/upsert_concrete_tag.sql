insert into morpheme_tag (system_id, abstract_ids, gloss, title, segment_type)
values ($1, $2, $3, $4, $5)
on conflict (system_id, abstract_ids) do update set
gloss = excluded.gloss,
title = excluded.title,
segment_type = excluded.segment_type
