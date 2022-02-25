SELECT *
FROM paragraph
WHERE page_id = ANY ($1)
ORDER BY character_range ASC
