insert into edited_collection(title, slug, description)
values ($1, $2, $3)
returning id
