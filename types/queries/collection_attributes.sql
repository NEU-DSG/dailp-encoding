select id, title, description, wordpress_menu_id, slug, thumbnail_url, is_hidden
from edited_collection
where slug = any($1)