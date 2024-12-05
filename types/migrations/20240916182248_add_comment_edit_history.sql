-- Add migration script here
alter table comment
  add column edited boolean not null DEFAULT false;