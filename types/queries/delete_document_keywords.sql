-- Delete all existing associations for this document
delete from document_keyword
where document_id = $1;