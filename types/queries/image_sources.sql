select id, title, base_url
from iiif_source
where id = any($1)
