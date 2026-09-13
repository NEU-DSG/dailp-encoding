select
  page_id,
  title,
  path,
  slug,
  content as body,
  created_at
from page
where path = $1;