insert into edited_collection(title, slug, description, thumbnail_url)
values ($1, $2, $3, $4)
returning id
