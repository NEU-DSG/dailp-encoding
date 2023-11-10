INSERT INTO user_bookmarked_document (document_id, user_id, bookmarked_on)
VALUES ($1, $2, NOW());