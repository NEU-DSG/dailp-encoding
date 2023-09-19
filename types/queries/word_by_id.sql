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
  media_resource.recorded_at as "audio_recorded_at?",
  media_resource.url as "audio_url?",
  media_slice.time_range as "audio_slice?",
  media_slice.id as "audio_slice_id?",
  contributor.id as "audio_recorded_by?",
  contributor.display_name as "audio_recorded_by_name?",
  word.include_audio_in_edited_collection,
  editor.id as "audio_edited_by?",
  editor.display_name as "audio_edited_by_name?"
from word
  left join media_slice on media_slice.id = word.audio_slice_id
  left join media_resource on media_resource.id = media_slice.resource_id
  left join dailp_user contributor on contributor.id = media_resource.recorded_by
  left join dailp_user editor on editor.id = media_resource.recorded_by
where
  word.id = $1
