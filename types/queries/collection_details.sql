SELECT
  slug,
  title,
  index_in_parent
FROM collection
WHERE slug = $1
