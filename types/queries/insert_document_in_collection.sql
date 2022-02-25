WITH new_document AS (
  INSERT INTO document (id, title, is_reference, written_at, audio_slice_id)
    VALUES ($1, $2, $3, $4, $5)
  RETURNING id
)
INSERT INTO document_collection_position (document_id, collection_id, index_in_collection)
SELECT
  id,
  $6,
  $7
FROM new_document
