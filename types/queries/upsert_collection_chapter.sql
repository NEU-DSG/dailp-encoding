/*
$1: uuid id
$2: text title (optional)
$3: collection_section section (optional)
$4: int index_in_parent (optional)
*/
update collection_chapter
set 
  title = coalesce($2, title),
  section = coalesce($3::collection_section, section),
  index_in_parent = coalesce($4, index_in_parent)
where id = $1::uuid