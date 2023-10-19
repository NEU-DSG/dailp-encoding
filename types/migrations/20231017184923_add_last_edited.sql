-- Add migration script here
alter table document
  add column last_edited date;
