SELECT
  id,
  source_text,
  simple_phonetics,
  phonemic,
  english_gloss,
  commentary,
  document_id,
  index_in_document
FROM word
WHERE source_text ILIKE $1
  OR simple_phonetics ILIKE $1
  OR english_gloss ILIKE $1
