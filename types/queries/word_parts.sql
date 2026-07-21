select
  word_segment.index_in_word,
  word_segment.word_id,
  word_segment.morpheme,
  word_segment.gloss_id,
  morpheme_gloss.gloss,
  word_segment.role as "role: WordSegmentRole",
  abbreviation_system.short_name as system
from word_segment
  inner join morpheme_gloss on morpheme_gloss.id = word_segment.gloss_id
  left join abbreviation_system on abbreviation_system.id = word_segment.system_id
where word_segment.word_id = any($1)
order by word_segment.index_in_word