select
  word_segment.word_id,
  word_segment.morpheme,
  word_segment.gloss_id,
  morpheme_gloss.gloss,
  word_segment.followed_by as "followed_by: SegmentType"
from word_segment
  inner join morpheme_gloss on morpheme_gloss.id = word_segment.gloss_id
where word_id = any($1)
order by index_in_word
