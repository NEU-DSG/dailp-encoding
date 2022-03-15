select
  document.id as document_id,
  document.is_reference,
  word.id,
  word.source_text,
  word.simple_phonetics,
  word.phonemic,
  word.english_gloss,
  word.recorded_at,
  word.commentary
from word
  inner join document on document.id = word.document_id
  left join word_segment on word_segment.word_id = word.id
  inner join morpheme_gloss on morpheme_gloss.id = word_segment.gloss_id
where morpheme_gloss.gloss = $1
  and (morpheme_gloss.document_id = $2 or $2 is null)
group by document.id, word.id
order by document.id
