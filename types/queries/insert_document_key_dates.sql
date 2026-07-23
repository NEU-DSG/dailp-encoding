-- Insert the new set of key date IDs
insert into document_key_date (document_id, key_date_id)
select $1, unnest($2::uuid[]);