--- -1 index removes the chapter and its children from the TOC to be  
--- unassigned and not accessible until reassigned
update collection_chapter
set
    index_in_parent = -1,
    section = 'Body'
where id = $1
    or chapter_path <@ (
        select chapter_path from collection_chapter WHERE id = $1
    )