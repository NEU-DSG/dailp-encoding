select id, title, wordpress_menu_id, slug
from edited_collection
where slug = any($1)