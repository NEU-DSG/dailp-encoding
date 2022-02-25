SELECT word.*,
  coalesce(jsonb_agg(word_segment ORDER BY index_in_word) FILTER (WHERE morpheme IS NOT NULL),
    '[]') AS segmentation
FROM word
  LEFT JOIN word_segment ON word_segment.word_id = word.id
WHERE word.document_id = $1
  -- Include all joined primary keys in the GROUP BY clause.
GROUP BY word.id
ORDER BY word.index_in_document
