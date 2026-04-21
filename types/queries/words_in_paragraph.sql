select
  paragraph.id as paragraph_id,
  word.id,
  src.value as source_text,
  sp.value as simple_phonetics,
  word.english_gloss,
  word.commentary,
  word.document_id,
  word.index_in_document,
  word.page_number,
  media_resource.url as "audio_url?",
  media_slice.time_range as "audio_slice?",
  word.audio_slice_id,
  media_resource.recorded_at as "audio_recorded_at?",
  contributor.id as "audio_recorded_by?",
  contributor.display_name as "audio_recorded_by_name?",
  word.include_audio_in_edited_collection,
  editor.id as "audio_edited_by?",
  editor.display_name as "audio_edited_by_name?"
from word
  left join word_spelling src on src.word_id = word.id
    and src.spelling_system = (select id from spelling_system where name = 'Source')
  left join word_spelling sp on sp.word_id = word.id
    and sp.spelling_system = (select id from spelling_system where name = 'Simple Phonetics')
  inner join paragraph on paragraph.page_id = word.page_id
  left join media_slice on media_slice.id = word.audio_slice_id
  left join media_resource on media_resource.id = media_slice.resource_id
  left join dailp_user contributor on contributor.id = media_resource.recorded_by
  left join dailp_user editor on editor.id = media_resource.recorded_by
where paragraph.id = any($1)
  and word.character_range is not null
  -- Include words that overlap with the paragraph range
  and word.character_range && paragraph.character_range
  -- Exclude words that start before the paragraph, which means that words are
  -- always included in the paragraph that they start in. This is the same logic
  -- as line breaks.
  and word.character_range &> paragraph.character_range
-- Include all joined primary keys in the GROUP BY clause.
-- Why? ^^
group by word.id,
  paragraph.id,
  media_slice.id,
  media_resource.id,
  contributor.id,
  editor.id,
  src.value,
  sp.value
order by word.character_range
