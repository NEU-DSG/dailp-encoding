-- Delete all existing associations for this document
delete from document_subject_heading
where document_id = $1;

-- Insert the new set of keyword IDs
insert into document_subject_heading (document_id, subject_heading_id)
select $1, unnest($2::uuid[]);