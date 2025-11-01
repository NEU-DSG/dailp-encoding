select 
    id, 
    name, 
    status::approval_status as status
from spatial_coverage sc
join document_spatial_coverage dsc on sc.id = dsc.spatial_coverage_id
where dsc.document_id = $1;