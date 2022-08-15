insert into collection_chapter (
  title,
  document_id,
  wordpress_id,
  index_in_parent,
  chapter_path)
values (
  $1,
  ( select id
    from document
    where short_name = $2),
  $3,
  $4,
  $5
)
