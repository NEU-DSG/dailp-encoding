insert into morpheme_tag (
  system_id, abstract_ids, gloss, title, role_override, description
)
values ($1, $2, $3, $4, $5, $6)
on conflict (system_id, abstract_ids) do update set
gloss = excluded.gloss,
title = excluded.title,
role_override = excluded.role_override,
description = excluded.description
