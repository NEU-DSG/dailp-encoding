--- Updates the chapter path, index, section, title, and optionally document id
--- so that it is properly updated within the toc
UPDATE collection_chapter
SET
    chapter_path = $1,
    index_in_parent = $2,
    section = $3,
    title = $4,
    document_id = $5
WHERE id = $6
RETURNING id