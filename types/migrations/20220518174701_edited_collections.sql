-- Add migration script here

-- A file for collections and chapters

create extension if not exists "ltree";

create table collections (
  id autouuid primary key,
  collection_name text not null,
  collection_desc text,
  slug ltree not null unique -- keep it the same type as chapter ltree
);

create table chapter (
  id autouuid primary key,
  title text not null,
  document_id uuid references document(id),
  wordpress_id bigint,
  index_tree ltree not null unique,
  slug text not null
);

create table chapter_attribution (
  chapter_id uuid not null references chapter (id) on delete cascade,
  contributor_id uuid not null references contributor (id) on delete cascade,
  contribution_role text not null,
  primary key (chapter_id, contributor_id)
);

create table index_trees (
  title text not null,
  index_tree ltree not null
)