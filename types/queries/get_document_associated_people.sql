-- Insert the new set of associated person IDs
insert into document_associated_person (document_id, associated_person_id)
select $1, unnest($2::uuid[]);