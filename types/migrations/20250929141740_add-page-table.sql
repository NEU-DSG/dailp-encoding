-- Add migration script here
create table if not exists page (
  page_id       autouuid  primary key,
  slug          text not null unique,
  path          text not null unique,
  title         text not null,
  content       text not null
);