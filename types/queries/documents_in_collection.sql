select
  d.id,
  d.title,
  d.written_at as "date: Date",
  pos.index_in_collection as order_index
from document as d
  inner join document_collection_position as pos on pos.document_id = d.id
  inner join collection on collection.id = pos.collection_id
where collection.super_collection = $1
  and collection.slug = $2
order by pos.index_in_collection asc
