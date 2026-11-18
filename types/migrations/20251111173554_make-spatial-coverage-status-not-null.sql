-- Make spatial coverage status non-nullable
alter table spatial_coverage
alter column status set not null;