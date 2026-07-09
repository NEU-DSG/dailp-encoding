-- Adding is_hidden column to collections defaulted as hidden
alter table edited_collection add column is_hidden boolean not null default true;