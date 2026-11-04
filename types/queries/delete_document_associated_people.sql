-- Delete all existing associations for this document
delete from document_associated_person
where document_id = $1;