select
  word_segment.morpheme,
  word.id as word_id,
  src.value as source_text,
  sp.value as simple_phonetics,
  word.english_gloss,
  word.commentary,
  word.document_id,
  word.index_in_document,
  word.page_number
from morpheme_gloss
  inner join document on document.id = morpheme_gloss.document_id
  left join word_segment on word_segment.gloss_id = morpheme_gloss.id
  left join word on word.id = word_segment.word_id
  left join word_spelling src on src.word_id = word.id
    and src.spelling_system = (select id from spelling_system where name = 'Source')
  left join word_spelling sp on sp.word_id = word.id
    and sp.spelling_system = (select id from spelling_system where name = 'Simple Phonetics')
where morpheme_gloss.gloss = $1
  and document.short_name = $2
order by word_segment.morpheme
