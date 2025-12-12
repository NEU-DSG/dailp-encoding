/*
$1: uuid chapter_id
*/
delete from collection_chapter
where id = $1;
