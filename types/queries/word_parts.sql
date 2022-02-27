select
  word_id,
  morpheme,
  gloss,
  followed_by as "followed_by: SegmentType"
from word_segment
where word_id = any($1)
order by index_in_word
