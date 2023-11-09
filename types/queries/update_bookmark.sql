UPDATE dailp_user
SET bookmarked_documents = CASE
    WHEN $3 = true AND NOT $2 = ANY(bookmarked_documents) THEN array_append(bookmarked_documents, $2)
    WHEN $3 = false THEN array_remove(bookmarked_documents, $2)
    ELSE bookmarked_documents
  END
WHERE id = $1;