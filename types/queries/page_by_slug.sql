select
  title,
  slug,
  content as body
from page
where slug = $1;