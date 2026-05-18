select 
    e.id,
    e.title,
    e.wordpress_menu_id,
    e.description,
    e.slug,
    e.thumbnail_url,
    e.publication_date,
    e.editors
from edited_collection as e;