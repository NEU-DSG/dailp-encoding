select
  id,
  index_in_document,
  document_id,
  iiif_source_id,
  iiif_oid
from document_page
where document_id = any($1)
order by index_in_document asc
