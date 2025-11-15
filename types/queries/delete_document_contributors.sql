-- Delete all existing associations for this document
delete from document_contributor
where document_id = $1;