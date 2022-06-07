select 
    collection_chapter.id
    collection_chapter.title
    collection_chapter.document_id
    collection_chapter.wordpress_id
    collection_chapter.chapter_path
from 
    collection_chapter
where
    (select chapter_path from collection_chapter where id=$1) @> collection_chapter.chapter_path