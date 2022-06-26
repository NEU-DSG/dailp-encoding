-- Insert a document-local morpheme gloss if and only if there's no matching
-- global gloss.
with inserted_gloss as (
  insert into morpheme_gloss (document_id, gloss)
    select * from unnest($1::uuid[], $2::text[]) as input_data(document_id, gloss)
    where not exists (select from morpheme_gloss where morpheme_gloss.document_id is null and morpheme_gloss.gloss = input_data.gloss)
  on conflict (coalesce(document_id, uuid_nil()), gloss) do nothing
  returning gloss, id
)

insert into word_segment (gloss_id, word_id, index_in_word, morpheme, followed_by)
-- Fill in glosses that weren't inserted with their global match.
select coalesce(inserted_gloss.id, global_gloss.id), word_id, index, morpheme, followed_by from unnest($2::text[], $3::uuid[], $4::bigint[], $5::text[], $6::segment_type[]) as input_data(gloss, word_id, index, morpheme, followed_by)
  left join inserted_gloss on inserted_gloss.gloss = input_data.gloss
  left join morpheme_gloss as global_gloss on global_gloss.document_id is null and global_gloss.gloss = input_data.gloss
on conflict (word_id, index_in_word)
  do update set
    morpheme = EXCLUDED.morpheme,
    gloss_id = EXCLUDED.gloss_id,
    followed_by = EXCLUDED.followed_by
