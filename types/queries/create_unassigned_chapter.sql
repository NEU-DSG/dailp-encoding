--- Creates a new page chapter that is not yet placed in the TOC
--- (index_in_parent = -1), so it shows up as an unassigned chapter.
insert into collection_chapter (title, index_in_parent, chapter_path)
values ($1, -1, $2)
returning
    id,
    title,
    slug,
    document_id
