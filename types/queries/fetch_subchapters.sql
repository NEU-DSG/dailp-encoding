select 
    collection_chapter.id
    collection_chapter.title
    collection_chapter.document_id
    collection_chapter.wordpress_id
    collection_chapter.slug_tree
from 
    collection_chapter
where
    (select slug_tree from collection_chapter where id=$1) @> collection_chapter.slug_tree