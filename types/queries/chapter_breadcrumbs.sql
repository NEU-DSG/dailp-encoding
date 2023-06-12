select id, title, slug, chapter_path
from collection_chapter
where chapter_path @> $1 and chapter_path != $1
