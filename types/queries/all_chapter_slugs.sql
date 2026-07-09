--- Grabs information required for ChapterSlugInfo of all unassinged slugs 
--- (chapters with a -1 index in collection_chapters)
select
    id,
    title,
    slug,
    document_id
from collection_chapter
where collection_slug = $1
and index_in_parent = -1
order by slug