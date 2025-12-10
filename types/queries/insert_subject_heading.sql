-- Insert a new subject heading into the database
insert into spatial_coverage (id, name, status)
values ($1::uuid, $2, $3);