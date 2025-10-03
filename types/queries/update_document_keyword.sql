-- Delete all existing associations for this document
delete from document_keyword
where document_id = $1;

-- Insert the new set of keyword IDs
insert into document_keyword (document_id, keyword_id)
select $1, unnest($2::uuid[]);