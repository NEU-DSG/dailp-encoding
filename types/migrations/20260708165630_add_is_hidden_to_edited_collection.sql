-- Adding is_hidden column to 
alter table edited_collection add column is_hidden boolean not null default false;