select
  word.id,
  word.source_text,
  word.simple_phonetics,
  word.phonemic,
  word.english_gloss,
  word.commentary,
  word.document_id,
  word.index_in_document,
  word.page_number,
  media_resource.url as "audio_url?",
  media_slice.time_range as "audio_slice?"
from word
  left join media_slice on media_slice.id = word.audio_slice_id
  left join media_resource on media_resource.id = media_slice.resource_id
where document_id = $1 AND (word.index_in_document >= $2 or $2 is null) and (word.index_in_document < $3 or $3 is null)
order by index_in_document
