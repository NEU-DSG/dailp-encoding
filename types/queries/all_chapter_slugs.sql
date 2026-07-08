--- Grabs information required for ChapterSlugInfo of all unassinged slugs 
--- (chapters with a -1 index in collection_chapters)
SELECT
    id,
    title,
    slug,
    document_id
FROM collection_chapter
WHERE collection_slug = $1
AND index_in_parent = -1
ORDER BY slug