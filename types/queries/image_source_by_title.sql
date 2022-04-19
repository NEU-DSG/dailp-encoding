select
  id,
  title,
  base_url
from iiif_source
where title = $1
