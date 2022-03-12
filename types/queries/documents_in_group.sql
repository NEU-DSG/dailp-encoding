select
  d.id,
  d.title,
  d.written_at as "date: Date",
  d.index_in_group as order_index
from document_group
  inner join document as d on document_group.id = d.group_id
where document_group.slug = $1
order by d.index_in_group asc
