/*
$1: id
$2: new_slug
$3: parent_id
*/
with current_tree as (
  select chapter_path from collection_chapter where id = $1
)

update collection_chapter set
  chapter_path = (
    select chapter_path from collection_chapter where id = $3
    union
    select slug::ltree from edited_collection where id = $3
  ) || subpath(
    $2::ltree || subpath(
      chapter_path || '0', nlevel((select chapter_path from current_tree))
    ),
    0, -1
  )
from collection_chapter where chapter_path <@ (select chapter_path from current_tree)
