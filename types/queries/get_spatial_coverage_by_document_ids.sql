select
  dsc.document_id,
  sc.id,
  sc.name,
  sc.status
from document_spatial_coverage dsc
join spatial_coverage sc on sc.id = dsc.spatial_coverage_id
where dsc.document_id = any($1);