-- Add migration script here

create type comment_type_enum as enum (
  'Story',
  'Correction',
  'Concern',
  'LingusticAnalysis'
);

create type comment_parent_type as enum (
  'Word',
  'Paragraph'
);

create table comment (
  id autouuid primary key,
  posted_at timestamp not null,
  posted_by uuid not null references dailp_user (id) on delete cascade,
  text_content text not null,
  comment_type comment_type_enum,
  parent_id uuid not null,
  parent_type comment_parent_type not null
);