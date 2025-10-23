SELECT l.* 
FROM language l
JOIN document_language dl ON l.id = dl.language_id
WHERE dl.document_id = $1;
