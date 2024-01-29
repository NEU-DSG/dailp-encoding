INSERT INTO user_bookmarked_document (document_id, user_id)
VALUES ($1, $2)
ON CONFLICT (document_id, user_id) DO NOTHING;