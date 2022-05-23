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
    select (select index_tree from chapter where id=$6
    union
    select slug from collections where id=$6)||$4)
insert into chapter (
    title, 
    document_id, 
    wordpress_id, 
    index_tree,
    slug)
select 
    $1,
    $2, 
    $3,
    cast ((select concat from new_index_tree) as ltree),
    $5;