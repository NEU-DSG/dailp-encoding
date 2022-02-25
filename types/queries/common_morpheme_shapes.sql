SELECT morpheme,
  count(word_id) AS word_count
FROM word_segment
WHERE gloss = 'PFT'
GROUP BY morpheme
ORDER BY word_count DESC
