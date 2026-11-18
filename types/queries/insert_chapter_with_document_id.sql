insert into collection_chapter (
  title,
  document_id,
  wordpress_id,
  index_in_parent,
  chapter_path,
  section)
values (
  $1,
  $2,
  $3,
  $4,
  $5,
  $6
)
returning id
