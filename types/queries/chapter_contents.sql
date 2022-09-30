select
  c.id,
  c.title,
  c.document_id,
  c.wordpress_id,
  c.index_in_parent,
  c.chapter_path,
  c.section as "section: CollectionSection"
from collection_chapter as c
where c.collection_slug = $1 
  and c.slug = $2;
