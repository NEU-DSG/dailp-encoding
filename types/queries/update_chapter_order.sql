/*
Update chapter order and section without touching the title.
Only updates index_in_parent and section for the given chapter id.
*/
UPDATE collection_chapter
SET 
    section = $2::collection_section,
    index_in_parent = $3
WHERE id = $1::uuid

