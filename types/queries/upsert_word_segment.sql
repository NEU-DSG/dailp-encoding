-- Look for a matching global gloss before trying to create a document-local gloss.
with global_gloss as (
  select morpheme_gloss.id
  from morpheme_gloss
  where document_id is null and gloss = $2
), inserted_gloss as (
  insert into morpheme_gloss (document_id, gloss)
    select $1, $2
    where not exists (select from global_gloss)
  on conflict (coalesce(document_id, uuid_nil()), gloss)
    do update set example_shape = excluded.example_shape,
       tag_id = excluded.tag_id
  returning id
)

insert into word_segment (word_id, index_in_word, morpheme, gloss_id, segment_type)
select $3, $4, $5, coalesce(global_gloss.id, inserted_gloss.id), $6
from global_gloss
full outer join inserted_gloss on true
on conflict (word_id, index_in_word)
  do update set
    morpheme = EXCLUDED.morpheme,
    gloss_id = EXCLUDED.gloss_id,
    segment_type = EXCLUDED.segment_type
