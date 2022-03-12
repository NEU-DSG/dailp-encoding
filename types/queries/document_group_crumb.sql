select
  document_group.slug,
  document_group.title
from document
inner join document_group on document_group.id = document.group_id
where document.id = $1
