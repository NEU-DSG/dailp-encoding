--- -1 index removes the chapter from the TOC to be unassigned and not 
--- accessible until reassigned
UPDATE collection_chapter
SET
    index_in_parent = -1,
    section = 'Body'
WHERE id = $1