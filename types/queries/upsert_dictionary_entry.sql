insert into morpheme_gloss (document_id, gloss, example_shape)
select $1, * from unnest($2::text[], $3::text[])
on conflict (coalesce(document_id, uuid_nil()), gloss)
  do update set
    example_shape = excluded.example_shape
