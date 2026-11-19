--- Updates the chapter path, index, section, title, and optionally document id
--- so that it is properly updated within the toc
update collection_chapter
set
    chapter_path = $1,
    index_in_parent = $2,
    section = $3,
    title = $4,
    -- Keep the chapter's document when none is given, so re-adding a chapter
    -- (e.g. a subchapter restored with its parent) never unlinks it
    document_id = coalesce($5, document_id)
where id = $6
returning id