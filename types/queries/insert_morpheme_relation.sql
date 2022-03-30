insert into morpheme_gloss_relation (left_gloss_id, right_gloss_id)
values ($1, $2)
on conflict
  do nothing
