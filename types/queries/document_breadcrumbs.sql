WITH RECURSIVE parent_tree AS (
  SELECT id,
    parent_id,
    slug,
    title
  FROM collection
    JOIN document_collection_position pos ON pos.document_id = $1
  WHERE super_collection = $2
    AND id = pos.collection_id
  UNION ALL
  SELECT p.id,
    p.parent_id,
    p.slug,
    p.title
  FROM collection p
    JOIN parent_tree ON parent_tree.parent_id = p.id
)
SELECT slug, title
FROM parent_tree
