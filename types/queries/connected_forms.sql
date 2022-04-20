with recursive relations as (
  -- Base case: all relations involving the input morpheme.
  select
    rl.left_gloss_id,
    rl.right_gloss_id
  from morpheme_gloss_relation as rl
    inner join
      morpheme_gloss on
        rl.left_gloss_id = morpheme_gloss.id or rl.right_gloss_id = morpheme_gloss.id
  where morpheme_gloss.gloss = $1 and morpheme_gloss.document_id = $2

  -- Recursive case: saturate the graph (no duplicates)
  union
  select
    rlr.left_gloss_id,
    rlr.right_gloss_id
  from morpheme_gloss_relation as rlr
    -- Retrieve all relations that involve any previous sources or destinations
    inner join
      relations on
        rlr.left_gloss_id = relations.right_gloss_id or rlr.right_gloss_id = relations.left_gloss_id or rlr.left_gloss_id = relations.left_gloss_id or rlr.right_gloss_id = relations.right_gloss_id
)

select
  word.id,
  word.source_text,
  word.simple_phonetics,
  word.phonemic,
  word.english_gloss,
  word.commentary,
  word.document_id,
  word.index_in_document,
  word.page_number,
  media_resource.url as "audio_url?",
  media_slice.time_range as "audio_slice?"
from relations
  inner join
    morpheme_gloss on
      morpheme_gloss.id = relations.left_gloss_id or morpheme_gloss.id = relations.right_gloss_id
  inner join word_segment on word_segment.gloss_id = morpheme_gloss.id
  inner join word on word.id = word_segment.word_id
  left join media_slice on media_slice.id = word.audio_slice_id
  left join media_resource on media_resource.id = media_slice.resource_id
order by word.document_id
