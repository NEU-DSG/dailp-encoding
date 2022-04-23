select
  word.*,
  paragraph.id as paragraph_id,
  media_slice.time_range as "audio_slice?",
  media_resource.url as "audio_url?"
from word
  inner join paragraph on paragraph.page_id = word.page_id
  left join media_slice on media_slice.id = word.audio_slice_id
  left join media_resource on media_resource.id = media_slice.resource_id
where paragraph.id = any($1)
  and word.character_range is not null
  -- Include words that overlap with the paragraph range
  and word.character_range && paragraph.character_range
  -- Exclude words that start before the paragraph, which means that words are
  -- always included in the paragraph that they start in. This is the same logic
  -- as line breaks.
  and word.character_range &> paragraph.character_range
-- Include all joined primary keys in the GROUP BY clause.
group by word.id,
  paragraph.id,
  media_slice.id,
  media_resource.id
order by word.character_range
