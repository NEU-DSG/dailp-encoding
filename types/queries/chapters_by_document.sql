-- Select all the chapters containing this document's id.
select
    c.id,
    c.title,
    c.document_id,
    c.wordpress_id,
    c.index_in_parent,
    c.chapter_path,
    c.section as "section: CollectionSection"
from collection_chapter as c
    inner join
        (select id from document where document.short_name = $1) as d on c.document_id = d.id;