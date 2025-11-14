-- Make genre status non-nullable
alter table genre
alter column status set not null;