-- get a paragraph by id
-- since paragraphs always include an index within their parent document
-- we have to count this paragraph's position in on the page
with all_paragraphs as (
  select
    id,
    english_translation as translation,
    ROW_NUMBER() OVER (order by character_range asc) as "index"
  from paragraph
  where page_id = (
    select p_inner.page_id from paragraph p_inner where id = $1
  )
) 

select
  id,
  translation,
  COALESCE(index, 1) as "index!" -- unclear why we need to upcast this
from all_paragraphs
where id=$1