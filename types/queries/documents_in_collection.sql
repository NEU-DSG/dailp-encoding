SELECT
  d.id,
  d.title,
  d.written_at AS "date: Date",
  pos.index_in_collection AS order_index
FROM document AS d
  INNER JOIN document_collection_position AS pos ON pos.document_id = d.id
  INNER JOIN collection ON collection.id = pos.collection_id
WHERE collection.super_collection = $1
  AND collection.slug = $2
ORDER BY pos.index_in_collection ASC
