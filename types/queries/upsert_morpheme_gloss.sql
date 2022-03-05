INSERT INTO morpheme_gloss (document_id, gloss, example_shape, tag_id)
  VALUES ($1, $2, $3, $4)
ON CONFLICT (document_id, gloss)
  DO UPDATE SET example_shape = EXCLUDED.example_shape
RETURNING id
