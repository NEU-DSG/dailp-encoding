select 
    chapter.id
    chapter.title
    chapter.document_id
    chapter.wordpress_id
    chapter.collection_path
from 
    chapter
where
    $1 @> chapter.collection_path