-- Grabs matching collection to document id
select
    c.document_id as "document_id!",
    ec.id as "id!",
    ec.title,
    ec.wordpress_menu_id,
    ec.slug,
    ec.description,
    ec.thumbnail_url,
    ec.is_hidden as "is_hidden!"
from collection_chapter c
join edited_collection ec ON ec.slug = c.collection_slug
where c.document_id = any($1)