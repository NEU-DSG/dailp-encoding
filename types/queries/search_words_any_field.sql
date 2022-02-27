select
  id,
  source_text,
  simple_phonetics,
  phonemic,
  english_gloss,
  commentary,
  document_id,
  index_in_document
from word
where source_text ilike $1
  or simple_phonetics ilike $1
  or english_gloss ilike $1
