INSERT INTO document_page (document_id, index_in_document, iiif_source_id, iiif_oid)
VALUES ($1, $2, $3, $4)
ON CONFLICT (document_id, index_in_document)
  DO UPDATE SET
    index_in_document = EXCLUDED.index_in_document,
    iiif_source_id = EXCLUDED.iiif_source_id,
    iiif_oid = EXCLUDED.iiif_oid
  RETURNING id
