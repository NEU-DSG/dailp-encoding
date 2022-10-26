select
  c.document_id,
  c.chapter_path
from collection_chapter as c
where c.document_id = $1