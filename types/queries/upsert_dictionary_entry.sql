INSERT INTO morpheme_gloss (document_id, gloss, example_shape)
  VALUES ($1, $2, $3)
ON CONFLICT (document_id, gloss)
  DO UPDATE SET
    example_shape = EXCLUDED.example_shape
  RETURNING id
