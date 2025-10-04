-- New document metadata

-- Shared enum for approval status of contributor suggestions
create type approval_status as enum (
    'pending', 
    'approved', 
    'rejected'
);

-- Genres
create table genre (
  id autouuid primary key,
  name text not null,
  status approval_status not null default 'pending'
);

-- Add FK from document to genre
alter table document
  add column genre_id uuid references genre(id);

-- Formats
create table doc_format (
  id autouuid primary key,
  name text not null,
  status approval_status not null default 'pending'
);

-- Add FK from document to format
alter table document
  add column format_id uuid references doc_format(id);

-- Keywords
create table keyword (
  id autouuid primary key,
  name text not null unique,
  -- Approval status of contributor-suggested keywords ('pending' by default)
  status approval_status not null default 'pending'
);

-- Join table between document and keyword to map which keywords are 
-- associated with which documents
create table document_keyword (
  document_id uuid not null references document(id) on delete cascade,
  keyword_id uuid not null references keyword(id) on delete cascade,
  primary key (document_id, keyword_id)
);

-- Subject Headings
create table subject_heading (
  id autouuid primary key,
  name text not null unique,
  status approval_status not null default 'pending'
);

-- Join table between document and subject heading to map which subject headings are 
-- associated with which documents
create table document_subject_heading (
  document_id uuid not null references document(id) on delete cascade,
  subject_heading_id uuid not null references subject_heading(id) on delete cascade,
  primary key (document_id, subject_heading_id)
);

-- Languages
create table language (
  id autouuid primary key,
  name text not null,
  autonym text,
  status approval_status not null default 'pending'
);

-- Join table between document and language to map which languages are 
-- associated with which documents
create table document_language (
  document_id uuid not null references document(id) on delete cascade,
  language_id uuid not null references language(id) on delete cascade,
  primary key (document_id, language_id)
);

-- Spatial Coverages
create table spatial_coverage (
  id autouuid primary key,
  name text not null,
  status approval_status not null default 'pending'
);

-- Join table between document and spatial coverage to map which spatial coverages are 
-- associated with which documents
create table document_spatial_coverage (
  document_id uuid not null references document(id) on delete cascade,
  spatial_coverage_id uuid not null references spatial_coverage(id) on delete cascade,
  primary key (document_id, spatial_coverage_id)
);

-- Citation
create table citation (
  id autouuid primary key,
  -- Get fields (ex. title, date written from document table)
  document_id uuid not null references document(id) on delete cascade,
  -- Add to or revise (find a better way to do this)
  -- check against document format field instead of list?
  doc_format text not null check (doc_format in ('book', 'webpage', 'journal', 'document')) default 'document'

);

-- Creator
create table creator (
  id autouuid primary key,
  name text not null
);

-- Join table between creator and document to map which creators are 
-- associated with which documents
create table document_creator (
  document_id uuid not null references document(id) on delete cascade,
  creator_id uuid not null references creator(id) on delete cascade,
  primary key (document_id, creator_id)
);

-- Join table between contributor and document to map which contributors are 
-- associated with which documents
create table document_contributor (
  document_id uuid not null references document(id) on delete cascade,
  contributor_id uuid not null references contributor(id) on delete cascade,
  primary key (document_id, contributor_id)
);

-- Add other metadata to document
alter table document
  add column url text,
  add column doi text;