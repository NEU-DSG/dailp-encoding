DELETE FROM user_bookmarked_document
WHERE document_id = $1 AND user_id = $2;