-- Delete all document pages, which will cascade to delete all associated
-- paragraphs and words.
delete from document_page
where document_id = $1
