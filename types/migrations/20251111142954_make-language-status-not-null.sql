-- Make language status non-nullable
alter table language
alter column status set not null;