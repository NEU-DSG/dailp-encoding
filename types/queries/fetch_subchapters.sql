select 
    collection_chapter.id
    collection_chapter.title
    collection_chapter.document_id
    collection_chapter.wordpress_id
    collection_chapter.slug
from 
    collection_chapter
where
    (select index_tree from collection_chapter where id=$1) @> collection_chapter.collection_path