SELECT d.id
FROM document as d
JOIN user_bookmarked_document as ubd on ubd.document_id = d.id
WHERE ubd.user_id = $1