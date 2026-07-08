UPDATE edited_collection
SET is_hidden = NOT is_hidden
WHERE id = $1
RETURNING id, title, description, wordpress_menu_id, slug, thumbnail_url, is_hidden