-- Insert the new set of subject heading IDs
insert into document_subject_heading (document_id, subject_heading_id)
select $1, unnest($2::uuid[]);