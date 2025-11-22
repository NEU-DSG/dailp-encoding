-- Delete a creator from a document
delete from document_creator
where document_id = $1::uuid;
