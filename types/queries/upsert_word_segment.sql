insert into word_segment (word_id, index_in_word, morpheme, gloss_id, followed_by)
values ($1, $2, $3, $4, $5)
on conflict (word_id, index_in_word)
  do update set
    morpheme = EXCLUDED.morpheme,
    gloss_id = EXCLUDED.gloss_id,
    followed_by = EXCLUDED.followed_by
