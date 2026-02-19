insert into morpheme_tag (
  system_id, abstract_ids, gloss, title, role_override, description
)
values ($1, $2, $3, $4, $5, $6)
returning id