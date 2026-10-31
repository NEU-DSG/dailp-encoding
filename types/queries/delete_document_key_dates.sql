-- Delete all existing associations for this document
delete from document_key_date
where document_id = $1;