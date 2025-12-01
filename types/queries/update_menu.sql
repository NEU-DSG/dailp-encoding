update  menu
set name = $2,
    slug = $3,
    items = $4
where id = $1
returning *;
