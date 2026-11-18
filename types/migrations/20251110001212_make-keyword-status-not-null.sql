-- Make keyword status non-nullable
alter table keyword
alter column status set not null;