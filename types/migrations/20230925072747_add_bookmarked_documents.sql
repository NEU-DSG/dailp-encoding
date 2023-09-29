-- Add migration script here
alter table dailp_user
  add column bookmarked_documents uuid[] not null default '{}';
