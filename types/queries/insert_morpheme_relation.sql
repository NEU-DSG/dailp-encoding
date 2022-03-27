INSERT INTO morpheme_gloss_relation (left_gloss_id, right_gloss_id)
  VALUES ($1, $2)
ON CONFLICT
  DO NOTHING
