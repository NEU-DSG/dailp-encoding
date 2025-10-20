select
  document_group.title,
  document_group.slug,
  document_group.id
from document_group
  left join document on document.group_id = document_group.id
where document.is_reference is false
group by document_group.id
order by document_group.title asc
