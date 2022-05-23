-- Add migration script here

-- A file for collection and chapters

create extension if not exists "ltree";

create table edited_collection (
  id autouuid primary key,
  title text not null,
  slug ltree not null unique -- keep it the same type as chapter ltree
);

create table collection_chapter (
  id autouuid primary key,
  title text not null,
  document_id uuid references document(id),
  wordpress_id bigint,
  index_tree ltree not null unique,
  slug text not null
);

create table collection_chapter_attribution (
  chapter_id uuid not null references collection_chapter (id) on delete cascade,
  contributor_id uuid not null references contributor (id) on delete cascade,
  contribution_role text not null,
  primary key (chapter_id, contributor_id)
);