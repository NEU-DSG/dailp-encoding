SELECT morpheme,
  array_agg(word.document_id)
FROM word_segment
  JOIN word ON word.id = word_segment.word_id
WHERE word_segment.gloss = '3SG.A'
GROUP BY word_segment.morpheme
