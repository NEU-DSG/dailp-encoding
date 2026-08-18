update edited_collection
set is_hidden = not is_hidden
where id = $1
returning id, title, description, wordpress_menu_id, slug, thumbnail_url, is_hidden