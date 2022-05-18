-- Add migration script here

-- A file for collections and chapters

create extension if not exists "ltree";

create table chapter (
  id autouuid primary key,
  title text not null,
  document_id uuid references document(id),
  wordpress_id bigint,
  collection_path ltree not null,
);

create table chapter_attribution (
  chapter_id uuid not null references chapter (id) on delete cascade,
  contributor_id uuid not null references contributor (id) on delete cascade,
  contribution_role text not null,
  primary key (chapter_id, contributor_id)
);