select id, title, wordpress_id, index_in_parent, ltree2text(subpath(chapter_path, 0, 1)) AS "slug!"
-- "" and ! makes it non nullable
--ltree2text first part of chapter path
-- get first part of chapter path
from collection_chapter
where ltree2text(subpath(chapter_path, 0, 1)) = any($1);
-- Receives string. Alter chapter_path to subpath and turn into string. match with input arg
-- 