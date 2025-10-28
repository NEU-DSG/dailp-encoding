-- Fetch all spatial coverages linked to a given set of documents
select
    dsc.document_id,
    sc.id,
    sc.name,
    sc.status::approval_status as status
from spatial_coverage sc
join document_spatial_coverage dsc on sc.id = dsc.spatial_coverage_id
where dsc.document_id = any($1);
