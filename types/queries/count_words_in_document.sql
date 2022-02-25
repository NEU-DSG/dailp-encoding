SELECT count(id)
FROM word
WHERE document_id = $1
