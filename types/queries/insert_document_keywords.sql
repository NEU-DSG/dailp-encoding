-- Insert the new set of keyword IDs
insert into document_keyword (document_id, keyword_id)
select $1, unnest($2::uuid[]);