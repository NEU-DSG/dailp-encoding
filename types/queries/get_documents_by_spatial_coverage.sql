-- Get all document associated with a given spatial coverage
select d.*
from document d
join document_spatial_coverage dsc on d.id = dsc.document_id
where dsc.spatial_coverage_id = $1;