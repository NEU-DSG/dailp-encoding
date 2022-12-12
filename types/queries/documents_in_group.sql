select
  d.id,
  d.short_name,
  d.title,
  d.written_at as "date: Date",
  d.index_in_group as order_index,
  c.chapter_path as "chapter_path?"
from document_group
  inner join document as d on document_group.id = d.group_id
  left join collection_chapter as c on c.document_id = d.id
where document_group.slug = $1
order by d.index_in_group asc
