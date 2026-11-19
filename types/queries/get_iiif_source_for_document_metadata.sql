-- grab both the document's oid and iiif base
select
  iiif_source.base_url,
  document_page.iiif_oid
from document_page
-- join them so long as they match and exist
inner join iiif_source on iiif_source.id = document_page.iiif_source_id
where document_page.document_id = $1
  and document_page.iiif_source_id is not null
  and document_page.iiif_oid is not null
order by document_page.index_in_document asc
limit 1