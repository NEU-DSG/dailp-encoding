SELECT
  title,
  slug
FROM collection
WHERE super_collection = ''
  AND parent_id IS NULL
ORDER BY index_in_parent ASC
