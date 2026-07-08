select 
    e.id,
    e.title,
    e.wordpress_menu_id,
    e.description,
    e.slug,
    e.thumbnail_url,
    e.is_hidden
from edited_collection as e;