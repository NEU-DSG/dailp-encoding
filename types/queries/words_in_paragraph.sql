SELECT
  word.*,
  paragraph.id AS paragraph_id
FROM word
  INNER JOIN paragraph ON paragraph.page_id = word.page_id
WHERE paragraph.id = ANY($1)
  AND word.character_range IS NOT NULL
  -- Include words that overlap with the paragraph range
  AND word.character_range && paragraph.character_range
  -- Exclude words that start before the paragraph, which means that words are
  -- always included in the paragraph that they start in. This is the same logic
  -- as line breaks.
  AND word.character_range &> paragraph.character_range
-- Include all joined primary keys in the GROUP BY clause.
GROUP BY word.id,
  paragraph.id
ORDER BY word.character_range
