-- Delete all existing associations for this document
delete from document_language
where document_id = $1;