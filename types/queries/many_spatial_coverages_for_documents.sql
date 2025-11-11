-- Fetch all spatial coverages linked to a given set of documents
select
    sc.id,
    sc.name,
    sc.status as "status: ApprovalStatus"
from spatial_coverage sc
join document_spatial_coverage dsc on sc.id = dsc.spatial_coverage_id
where dsc.document_id = any($1);