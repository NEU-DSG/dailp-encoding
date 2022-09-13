select c.id, 
    c.title, 
    document.short_name, 
    c.wordpress_id, 
    c.index_in_parent, 
    c.chapter_path, 
    c.section::text
from collection_chapter as c
    left join document on c.document_id = document.id
where chapter_path = $1