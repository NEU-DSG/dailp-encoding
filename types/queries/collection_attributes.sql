select id, title, description, wordpress_menu_id, slug, thumbnail_url, publication_date, editors
from edited_collection
where slug = any($1)