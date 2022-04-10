-- Look for a matching global gloss before trying to create a document-local gloss.
with global_gloss as (
  select morpheme_gloss.id
  from morpheme_gloss
    inner join
      abstract_morpheme_tag as abstract on morpheme_gloss.tag_id = abstract.id
  where document_id is null and gloss = $2
  limit 1
), inserted_gloss as (
  insert into morpheme_gloss (document_id, gloss)
    select $1, $2
    where not exists (select id from global_gloss)
  on conflict (document_id, gloss)
    do update set example_shape = excluded.example_shape,
       tag_id = excluded.tag_id
  returning id
)

insert into word_segment (word_id, index_in_word, morpheme, gloss_id, followed_by)
select $3, $4, $5, coalesce(global_gloss.id, inserted_gloss.id), $6
from global_gloss, inserted_gloss
on conflict (word_id, index_in_word)
  do update set
    morpheme = EXCLUDED.morpheme,
    gloss_id = EXCLUDED.gloss_id,
    followed_by = EXCLUDED.followed_by
