-- Insert a new subject heading into the database
insert into subject_heading (id, name, status)
values ($1::uuid, $2, $3)
returning id;