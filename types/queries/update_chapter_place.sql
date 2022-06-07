/*
$1: id
$2: new_slug
$3: parent_id
*/
with current_tree as (
    select slug_tree from collection_chapter where id=$1
)
update collection_chapter set
slug_tree = (
    select slug_tree from collection_chapter where id=$3
    union
    select slug::ltree from edited_collection where id=$3
) || subpath ( 
    $2::ltree || subpath (slug_tree || '0', nlevel((select slug_tree from current_tree))), 
    0, -1
)
    from collection_chapter where slug_tree <@ (select slug_tree from current_tree)