select
  slug,
  title
from super_collection
where slug = $1
