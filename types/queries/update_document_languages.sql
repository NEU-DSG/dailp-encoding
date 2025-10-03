-- Delete all existing associations for this document
delete from document_language
where document_id = $1;

-- Insert the new set of keyword IDs
insert into document_language (document_id, language_id)
select $1, unnest($2::uuid[]);