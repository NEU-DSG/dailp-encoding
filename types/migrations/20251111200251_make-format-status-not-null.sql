-- Make format status non-nullable
alter table doc_format
alter column status set not null;