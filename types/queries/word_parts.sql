select
  word_segment.index_in_word,
  word_segment.word_id,
  word_segment.morpheme,
  word_segment.gloss_id,
  morpheme_gloss.gloss,
  word_segment.role as "role: WordSegmentRole",
  abstract_morpheme_tag.representation_system_type as "representation_system_type: String"
from word_segment
  inner join morpheme_gloss on morpheme_gloss.id = word_segment.gloss_id
  left join abstract_morpheme_tag on abstract_morpheme_tag.id = morpheme_gloss.tag_id
where word_segment.word_id = any($1)
order by word_segment.index_in_word