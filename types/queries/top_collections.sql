select
  title,
  slug
from collection
where super_collection = ''
  and parent_id is null
order by index_in_parent asc
