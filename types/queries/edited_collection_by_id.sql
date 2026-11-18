SELECT
    id,
    slug,
    title,
    wordpress_menu_id
FROM
    edited_collection
WHERE
    id = $1
