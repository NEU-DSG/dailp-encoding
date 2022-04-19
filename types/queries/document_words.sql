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
where document_id = $1
order by index_in_document
