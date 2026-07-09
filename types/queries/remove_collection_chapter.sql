--- -1 index removes the chapter from the TOC to be unassigned and not 
--- accessible until reassigned
update collection_chapter
set
    index_in_parent = -1,
    section = 'Body'
where id = $1