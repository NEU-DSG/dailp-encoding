select
  word.id,
  src.value as source_text,
  sp.value as simple_phonetics,
  word.english_gloss,
  word.commentary,
  word.document_id,
  word.index_in_document,
  word.page_number,
  media_resource.recorded_at as "audio_recorded_at?",
  media_resource.url as "audio_url?",
  media_slice.time_range as "audio_slice?",
  media_slice.id as "audio_slice_id?",
  contributor.id as "audio_recorded_by?",
  contributor.display_name as "audio_recorded_by_name?",
  word.include_audio_in_edited_collection as "include_audio_in_edited_collection",
  editor.id as "audio_edited_by?",
  editor.display_name as "audio_edited_by_name?"
from word
  left join word_spelling src on src.word_id = word.id
    and src.spelling_system = (select id from spelling_system where name = 'Source')
  left join word_spelling sp on sp.word_id = word.id
    and sp.spelling_system = (select id from spelling_system where name = 'Simple Phonetics')
  left join media_slice on media_slice.id = word.audio_slice_id
  left join media_resource on media_resource.id = media_slice.resource_id
  left join dailp_user contributor on contributor.id = media_resource.recorded_by
  left join dailp_user editor on editor.id = word.audio_edited_by
where src.value like any($1)
