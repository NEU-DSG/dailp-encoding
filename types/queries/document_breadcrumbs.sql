with recursive parent_tree as (
  select
    id,
    parent_id,
    slug,
    title
  from collection
    inner join document_collection_position as pos on pos.document_id = $1
  where super_collection = $2
    and id = pos.collection_id
  union all
  select
    p.id,
    p.parent_id,
    p.slug,
    p.title
  from collection as p
    inner join parent_tree on parent_tree.parent_id = p.id
)

select
  slug,
  title
from parent_tree
