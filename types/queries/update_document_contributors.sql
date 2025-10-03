-- Delete all existing associations for this document
delete from document_contributor
where document_id = $1;

-- Insert the new set of keyword IDs
insert into document_contributor (document_id, contributor_id)
select $1, unnest($2::uuid[]);