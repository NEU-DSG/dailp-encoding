/*
$1: id
$2: new_index
$3: parent_id
*/
with current_tree as (
    select index_tree from collection_chapter where id=$1
)
update collection_chapter set
index_tree = (
    select index_tree from collection_chapter where id=$3
    union
    select slug from edited_collection where id=$3
) || subpath ( 
    $2::text || subpath (index_tree || '0', nlevel((select index_tree from current_tree))), 
    0, -1
)
    from collection_chapter where index_tree <@ (select index_tree from current_tree)