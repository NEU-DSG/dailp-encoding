select
  slug,
  title,
  id
from document_group
where slug = $1
