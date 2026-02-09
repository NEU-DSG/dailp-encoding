-- Delete all existing associations for this document
delete from document_subject_heading
where document_id = $1;