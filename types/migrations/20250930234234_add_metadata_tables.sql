-- New document metadata

-- Shared enum for approval status of contributor suggestions
drop type if exists approval_status cascade;
create type approval_status as enum (
  'pending', 
  'approved', 
  'rejected'
);

-- Genres
create table if not exists genre (
    id autouuid primary key,
    name text not null,
    status approval_status default 'pending'
);

-- Add FK from document to genre
alter table if exists document
  add column if not exists genre_id uuid null references genre(id);

-- Formats
create table if not exists doc_format (
    id autouuid primary key,
    name text not null,
    status approval_status default 'pending'
);

-- Add FK from document to format
alter table if exists document
  add column if not exists format_id uuid null references doc_format(id);

-- Keywords
create table if not exists keyword (
  id autouuid primary key,
  name text not null unique,
  -- Approval status of contributor-suggested keywords ('pending' by default)
  status approval_status default 'pending'
);

-- Join table between document and keyword to map which keywords are 
-- associated with which documents
create table if not exists document_keyword (
  document_id uuid not null references document(id) on delete cascade,
  keyword_id uuid not null references keyword(id) on delete cascade,
  primary key (document_id, keyword_id)
);

-- Subject Headings
create table if not exists subject_heading (
  id autouuid primary key,
  name text not null unique,
  status approval_status default 'pending'
);

-- Join table between document and subject heading to map which subject headings are 
-- associated with which documents
create table if not exists document_subject_heading (
  document_id uuid not null references document(id) on delete cascade,
  subject_heading_id uuid not null references subject_heading(id) on delete cascade,
  primary key (document_id, subject_heading_id)
);

-- Languages
create table if not exists language (
  id autouuid primary key,
  name text not null,
  autonym text NULL,
  status approval_status default 'pending'
);

-- Join table between document and language to map which languages are 
-- associated with which documents
create table if not exists document_language (
  document_id uuid not null references document(id) on delete cascade,
  language_id uuid not null references language(id) on delete cascade,
  primary key (document_id, language_id)
);

-- Spatial Coverages
create table if not exists spatial_coverage (
  id autouuid primary key,
  name text not null,
  status approval_status default 'pending'
);

-- Join table between document and spatial coverage to map which spatial coverages are 
-- associated with which documents
create table if not exists document_spatial_coverage (
  document_id uuid not null references document(id) on delete cascade,
  spatial_coverage_id uuid not null references spatial_coverage(id) on delete cascade,
  primary key (document_id, spatial_coverage_id)
);

-- Creator
create table if not exists creator (
  id autouuid primary key,
  name text not null
);

-- Join table between creator and document to map which creators are 
-- associated with which documents
create table if not exists document_creator (
  document_id uuid not null references document(id) on delete cascade,
  creator_id uuid not null references creator(id) on delete cascade,
  primary key (document_id, creator_id)
);

-- Add other metadata to document
alter table if exists document
  add column if not exists url text null,
  add column if not exists doi text null,
  add column if not exists pages text null;

-- Defines a contributor's contributions to the associated item
drop type if exists contributor_role cascade;
create type contributor_role as enum (
  'Transcriber',
  'Translator',
  'Annotator',
  'CulturalAdvisor'
);

-- Join table between contributors and roles
create table if not exists contributor_role_map (
  contributor_id uuid references contributor(id) on delete cascade,
  role contributor_role not null,
  primary key (contributor_id, role)
);

-- Join table between contributor and document to map which contributors are 
-- associated with which documents
create table if not exists document_contributor (
  document_id uuid not null references document(id) on delete cascade,
  contributor_id uuid not null references contributor(id) on delete cascade,
  primary key (document_id, contributor_id)
);