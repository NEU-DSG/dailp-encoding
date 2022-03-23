select
  word.*,
  paragraph.id as paragraph_id
from word
  inner join paragraph on paragraph.page_id = word.page_id
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
  paragraph.id
order by word.character_range
