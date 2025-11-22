-- Insert the new set of contributor IDs
insert into document_contributor (document_id, contributor_id)
select $1, unnest($2::uuid[]);