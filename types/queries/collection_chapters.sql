select id, title, wordpress_id, index_in_parent, ltree2text(subpath(chapter_path, 0, 1)) AS "collection_slug!"
from collection_chapter
where ltree2text(subpath(chapter_path, 0, 1)) = any($1);