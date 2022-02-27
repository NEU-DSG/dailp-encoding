INSERT INTO document_page (document_id, index_in_document)
VALUES ($1, $2)
ON CONFLICT (document_id, index_in_document)
  DO UPDATE SET
    index_in_document = EXCLUDED.index_in_document
  RETURNING id
