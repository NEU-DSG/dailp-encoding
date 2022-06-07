/*
$1: str title
$2: ref doc_id
$3: int wp_id
$4: int index
$5: str slug
$6: ref parent_id
*/
with 
new_index_tree as (
    select (select chapter_path from collection_chapter where id=$6
    union
    select slug::ltree from edited_collection where id=$6)||$5)
insert into collection_chapter (
    title, 
    document_id, 
    wordpress_id, 
    index_in_parent,
    chapter_path)
select 
    $1,
    $2, 
    $3,
    $4,
    (select * from new_index_tree)