INSERT INTO word_segment (word_id, index_in_word, morpheme, gloss, followed_by)
VALUES ($1, $2, $3, $4, $5)
ON CONFLICT (word_id, index_in_word)
  DO UPDATE SET
    morpheme = EXCLUDED.morpheme,
    gloss = EXCLUDED.gloss,
    followed_by = EXCLUDED.followed_by
