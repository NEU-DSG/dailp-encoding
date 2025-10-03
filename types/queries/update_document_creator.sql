-- Delete all existing associations for this document
delete from document_creator
where document_id = $1;

-- Insert the new set of keyword IDs
insert into document_creator (document_id, creator_id)
select $1, unnest($2::uuid[]);