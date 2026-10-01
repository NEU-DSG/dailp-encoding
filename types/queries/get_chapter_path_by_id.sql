--- Return chapter path of chapter by its id
select chapter_path::text
from collection_chapter
where id = $1