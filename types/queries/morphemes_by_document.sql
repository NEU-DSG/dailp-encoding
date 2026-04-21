select
  document.id as document_id,
  document.is_reference,
  word.id,
  src.value as source_text,
  sp.value as simple_phonetics,
  word.english_gloss,
  word.recorded_at,
  word.commentary,
  word.index_in_document,
  word.page_number
from word
  left join word_spelling src on src.word_id = word.id
    and src.spelling_system = (select id from spelling_system where name = 'Source')
  left join word_spelling sp on sp.word_id = word.id
    and sp.spelling_system = (select id from spelling_system where name = 'Simple Phonetics')
  inner join document on document.id = word.document_id
  left join word_segment on word_segment.word_id = word.id
  inner join morpheme_gloss on morpheme_gloss.id = word_segment.gloss_id
where morpheme_gloss.gloss = $1
  and (word.document_id = $2 or $2 is null)
group by document.id, word.id, src.value, sp.value
order by document.id
