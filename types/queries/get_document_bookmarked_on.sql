SELECT bookmarked_on, document_id, user_id
FROM user_bookmarked_document AS ubd
WHERE ubd.document_id = any($1) AND ubd.user_id = any($2)