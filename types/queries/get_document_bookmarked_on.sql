SELECT ubd.bookmarked_on
FROM user_bookmarked_document AS ubd
WHERE ubd.document_id = $1 AND ubd.user_id = $2