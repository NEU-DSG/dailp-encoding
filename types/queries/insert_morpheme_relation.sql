-- Retrieve the database UUIDs for the morpheme glosses passed in.
with left_gloss as (
  select morpheme_gloss.id
  from morpheme_gloss
    left join document on document.id = morpheme_gloss.document_id
  where morpheme_gloss.gloss = $1 and document.short_name = $2
),

right_gloss as (
  select morpheme_gloss.id
  from morpheme_gloss
    left join document on document.id = morpheme_gloss.document_id
  where morpheme_gloss.gloss = $3 and document.short_name = $4
)

insert into morpheme_gloss_relation (left_gloss_id, right_gloss_id)
select
  left_gloss.id,
  right_gloss.id
from left_gloss, right_gloss
on conflict do nothing
