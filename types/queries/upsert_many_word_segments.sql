insert into word_segment (gloss_id, word_id, index_in_word, morpheme, role)
-- Fill in glosses that weren't inserted with their global match.
select
  coalesce(inserted_gloss.id, global_gloss.id),
  word_id,
  index,
  morpheme,
  role
from
  unnest(
    $1::uuid[], $2::text[], $3::uuid[], $4::bigint[], $5::text[], $6::word_segment_role[]
  ) as input_data(document_id, gloss, word_id, index, morpheme, role)
  left join
    morpheme_gloss as inserted_gloss on
      inserted_gloss.document_id = input_data.document_id and inserted_gloss.gloss = input_data.gloss
  left join
    morpheme_gloss as global_gloss on
      global_gloss.document_id is null and global_gloss.gloss = input_data.gloss
on conflict (word_id, index_in_word)
do update set
morpheme = excluded.morpheme,
gloss_id = excluded.gloss_id,
role = excluded.role
