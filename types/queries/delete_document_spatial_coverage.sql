-- Delete all existing associations for this document
delete from document_spatial_coverage
where document_id = $1;

