SELECT word_id,
  morpheme,
  gloss,
  followed_by AS "followed_by: SegmentType"
FROM word_segment
WHERE word_id = any($1)
ORDER BY index_in_word
