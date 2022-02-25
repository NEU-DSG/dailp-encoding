INSERT INTO morpheme_gloss_relation (left_document_id, left_gloss, right_document_id, right_gloss)
  VALUES ($1, $2, $3, $4)
ON CONFLICT
  DO NOTHING
