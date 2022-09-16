select c.id, 
    c.title, 
    c.document_id, 
    c.wordpress_id, 
    c.index_in_parent, 
    c.chapter_path, 
    c.section::text
from collection_chapter as c
where chapter_path ~ ($1 || '.*.' || $2)::lquery;