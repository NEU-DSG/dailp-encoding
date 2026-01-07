select
    id,
    title,
    document_id,
    wordpress_id,
    index_in_parent,
    section as "section: CollectionSection",
    chapter_path,
    ltree2text(subpath(chapter_path, 0, 1)) AS "collection_slug!"
from collection_chapter
where ltree2text(subpath(chapter_path, 0, 1)) = any($1)
order by nlevel(chapter_path), index_in_parent;