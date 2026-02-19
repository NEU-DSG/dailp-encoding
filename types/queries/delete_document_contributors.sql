-- Delete all existing associations for this document
delete from contributor_attribution
where document_id = $1;