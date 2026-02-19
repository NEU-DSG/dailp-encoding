select
  page_id,
  title,
  path,
  slug,
  content as body
from page
where path = $1;