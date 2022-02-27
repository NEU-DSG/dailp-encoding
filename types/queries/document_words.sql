select
  word.*,
  coalesce(
    jsonb_agg(
      word_segment order by index_in_word
    ) filter (where morpheme is not null),
    '[]') as segmentation
from word
  left join word_segment on word_segment.word_id = word.id
where word.document_id = $1
-- Include all joined primary keys in the GROUP BY clause.
group by word.id
order by word.index_in_document
