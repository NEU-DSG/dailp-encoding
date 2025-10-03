-- Delete all existing associations for this document
delete from document_spatial_coverage
where document_id = $1;

-- Insert the new set of keyword IDs
insert into document_spatial_coverage (document_id, spatial_coverage_id)
select $1, unnest($2::uuid[]);