SELECT f.* 
FROM format f
JOIN document_metadata dm ON f.id = dm.format_id
WHERE dm.id = $1;
