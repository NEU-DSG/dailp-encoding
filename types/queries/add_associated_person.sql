-- Add a new person associated with a document
insert into associated_person (name)
values ($1)
returning id;