INSERT INTO word (source_text, simple_phonetics, phonemic, english_gloss, recorded_at, commentary,
  document_id, page_number, index_in_document, page_id, character_range)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
ON CONFLICT (document_id, index_in_document)
DO UPDATE SET
  source_text = EXCLUDED.source_text,
  simple_phonetics = EXCLUDED.simple_phonetics,
  phonemic = EXCLUDED.phonemic,
  english_gloss = EXCLUDED.english_gloss,
  commentary = EXCLUDED.commentary
RETURNING id
