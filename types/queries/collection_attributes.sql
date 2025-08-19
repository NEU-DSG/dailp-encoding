select id, title, description, wordpress_menu_id, slug, thumbnail_url
from edited_collection
where slug = any($1)