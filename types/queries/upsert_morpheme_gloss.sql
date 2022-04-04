insert into morpheme_gloss (document_id, gloss, example_shape, tag_id)
  values ($1, $2, $3, $4)
on conflict (document_id, gloss)
  do update set example_shape = excluded.example_shape,
     tag_id = excluded.tag_id
returning id
