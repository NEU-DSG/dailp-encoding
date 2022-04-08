insert into morpheme_gloss (document_id, gloss, example_shape)
values ($1, $2, $3)
on conflict (document_id, gloss)
  do update set
    example_shape = excluded.example_shape
  returning id
