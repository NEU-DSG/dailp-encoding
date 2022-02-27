select
  slug,
  title,
  index_in_parent
from collection
where slug = $1
