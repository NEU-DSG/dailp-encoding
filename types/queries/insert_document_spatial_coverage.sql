-- Insert the new set of spatial coverage IDs
insert into document_spatial_coverage (document_id, spatial_coverage_id)
select $1, unnest($2::uuid[]);