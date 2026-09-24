-- Count top-level chapters in a section for a collection
-- $1: collection_slug (text)
-- $2: section (collection_section enum)
-- Returns: count of top-level chapters (chapters with nlevel(chapter_path) = 2)
select count(*)::bigint
from collection_chapter
where ltree2text(subpath(chapter_path, 0, 1)) = $1
  and section = $2
  and nlevel(chapter_path) = 2;

