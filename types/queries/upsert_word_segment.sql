INSERT INTO word_segment (word_id, index_in_word, morpheme, gloss_id, followed_by)
VALUES ($1, $2, $3, $4, $5)
ON CONFLICT (word_id, index_in_word)
  DO UPDATE SET
    morpheme = EXCLUDED.morpheme,
    gloss_id = EXCLUDED.gloss_id,
    followed_by = EXCLUDED.followed_by
