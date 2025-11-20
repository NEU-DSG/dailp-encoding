-- Make subject heading status non-nullable
alter table subject_heading
alter column status set not null;