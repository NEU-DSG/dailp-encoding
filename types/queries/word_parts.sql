select distinct on (word_segment.word_id, word_segment.index_in_word)
  word_segment.index_in_word,
  word_segment.word_id,
  word_segment.morpheme,
  word_segment.gloss_id,
  morpheme_gloss.gloss,
  word_segment.segment_type as "segment_type: SegmentType"
from word_segment
  inner join morpheme_gloss on morpheme_gloss.id = word_segment.gloss_id
  left join abstract_morpheme_tag on abstract_morpheme_tag.id = morpheme_gloss.tag_id
  left join morpheme_tag on abstract_morpheme_tag.id = morpheme_tag.abstract_ids[1]
where word_segment.word_id = any($1)
order by word_segment.word_id, word_segment.index_in_word
