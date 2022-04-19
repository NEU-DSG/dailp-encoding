select
  id,
  source_text,
  simple_phonetics,
  phonemic,
  english_gloss,
  commentary,
  document_id,
  index_in_document,
  page_number
from word
where source_text like any($1)
