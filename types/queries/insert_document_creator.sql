-- Insert the new set of creator IDs
insert into document_creator (document_id, creator_id)
select $1, unnest($2::uuid[]);