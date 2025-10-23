SELECT c.* 
FROM contributor c 
JOIN document_contributor dc 
ON dc.contributor_id = c.id 
WHERE dc.document_id = $1;