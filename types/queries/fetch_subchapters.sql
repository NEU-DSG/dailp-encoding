select 
    chapter.id
    chapter.chapter_title
    chapter.document_title
    chapter.author
    chapter.document_id
    chapter.wordpress_id
    chapter.collection_path
from 
    chapter
where
    $1 @> chapter.collection_path