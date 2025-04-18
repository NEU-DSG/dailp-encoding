insert into edited_collection (title, wordpress_menu_id, slug)
values ($1, $2, $3)
returning id