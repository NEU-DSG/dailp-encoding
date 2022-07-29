insert into edited_collection (slug, title, wordpress_menu_id)
values ($1, $2, $3)
on conflict (slug) do update
set title = excluded.title,
wordpress_menu_id = excluded.wordpress_menu_id
