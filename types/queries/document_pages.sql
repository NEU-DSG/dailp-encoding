SELECT id, index_in_document, document_id
FROM document_page
WHERE document_id = ANY ($1)
ORDER BY index_in_document ASC
