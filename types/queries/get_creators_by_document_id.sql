SELECT c.* 
FROM creator c 
JOIN document_creator dc 
ON dc.creator_id = c.id 
WHERE dc.document_id = $1;