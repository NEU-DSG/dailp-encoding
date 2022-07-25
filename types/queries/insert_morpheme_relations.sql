insert into morpheme_gloss_relation (left_gloss_id, right_gloss_id)
select
  left_gloss.id,
  right_gloss.id
from
  unnest(
    $1::text[], $2::text[], $3::text[], $4::text[]
  ) as input_relation(left_doc_name, left_gloss, right_doc_name, right_gloss)
  inner join document as left_doc on left_doc.short_name = input_relation.left_doc_name
  inner join
    morpheme_gloss as left_gloss on
      left_gloss.gloss = input_relation.left_gloss and left_gloss.document_id = left_doc.id
  inner join
    document as right_doc on right_doc.short_name = input_relation.right_doc_name
  inner join
    morpheme_gloss as right_gloss on
      right_gloss.gloss = input_relation.right_gloss and right_gloss.document_id = right_doc.id
on conflict do nothing
