select
  slug,
  title
from document_group
where slug = $1
