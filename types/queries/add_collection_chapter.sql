--- Updates the chapter path, index, section, title, and optionally document id
--- so that it is properly updated within the toc
update collection_chapter
set
    chapter_path = $1,
    index_in_parent = $2,
    section = $3,
    title = $4,
    document_id = $5
where id = $6
returning id