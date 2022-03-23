select
  word_segment.morpheme,
  word.id as word_id,
  word.source_text,
  word.simple_phonetics,
  word.phonemic,
  word.english_gloss,
  word.commentary,
  word.document_id,
  word.index_in_document,
  word.page_number
from morpheme_gloss
  left join word_segment on word_segment.gloss_id = morpheme_gloss.id
  left join word on word.id = word_segment.word_id
where morpheme_gloss.gloss = $1
  and morpheme_gloss.document_id = $2
order by word_segment.morpheme
