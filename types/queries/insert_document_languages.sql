update_document_metadata-- Insert the new set of language IDs
insert into document_language (document_id, language_id)
select $1, unnest($2::uuid[]);