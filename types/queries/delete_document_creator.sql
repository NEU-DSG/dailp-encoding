-- Delete all existing associations for this document
delete from document_creator
where document_id = $1;