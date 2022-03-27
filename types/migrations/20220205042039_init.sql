-- Always use bigint instead of int.
-- https://blog.rustprooflabs.com/2021/06/postgres-bigint-by-default

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE DOMAIN autouuid uuid DEFAULT uuid_generate_v4 ();

-- Base website: Language > Group > Document
-- CWKW: Collection > Chapter > Sub-chapter > Page + Document

CREATE TABLE document_group (
  id autouuid primary key,
  slug text not null unique,
  title text not null
);

CREATE TABLE audio_resource (
  id autouuid PRIMARY KEY,
  url text NOT NULL,
  recorded_at date
);

CREATE TABLE audio_slice (
  id autouuid PRIMARY KEY,
  resource_id uuid NOT NULL REFERENCES audio_resource (id) ON DELETE CASCADE,
  time_range int8range
);

CREATE TABLE document (
  id autouuid primary key,
  short_name text not null unique,
  title text NOT NULL,
  group_id uuid not null references document_group (id) on delete cascade,
  index_in_group bigint not null default 0,
  is_reference boolean NOT NULL,
  written_at date,
  audio_slice_id uuid REFERENCES audio_slice (id) ON DELETE SET NULL
);

CREATE TABLE iiif_source (
  id autouuid PRIMARY KEY,
  title text NOT NULL,
  base_url text NOT NULL unique
);

CREATE TABLE document_page (
  id autouuid PRIMARY KEY,
  document_id uuid NOT NULL REFERENCES document (id) ON DELETE CASCADE,
  index_in_document bigint NOT NULL,
  iiif_source_id uuid REFERENCES iiif_source (id),
  iiif_oid text,
  CONSTRAINT document_page_iiif_image_has_id CHECK (iiif_source_id IS NULL OR iiif_oid IS NOT NULL),
  UNIQUE (document_id, index_in_document)
);

-- TODO Model character-based transcriptions first!
CREATE TABLE character_transcription (
  id autouuid PRIMARY KEY,
  page_id uuid NOT NULL REFERENCES document_page (id) ON DELETE CASCADE,
  index_in_page bigint NOT NULL,
  possible_transcriptions text[] not null,
  image_area box
);

-- Used both for known static contributors and active users.
CREATE TABLE contributor (
  id autouuid PRIMARY KEY,
  full_name text NOT NULL UNIQUE
);

CREATE TABLE contributor_attribution (
  document_id uuid NOT NULL REFERENCES document (id) ON DELETE CASCADE,
  contributor_id uuid NOT NULL REFERENCES contributor (id) ON DELETE CASCADE,
  contribution_role text NOT NULL,
  PRIMARY KEY (document_id, contributor_id)
);

CREATE TABLE document_source (
  id autouuid PRIMARY KEY,
  name text NOT NULL,
  url text NOT NULL
);

-- This table bridges from documents to sources.
CREATE TABLE document_source_citation (
  document_id uuid NOT NULL REFERENCES document (id) ON DELETE CASCADE,
  source_id uuid NOT NULL REFERENCES document_source (id) ON DELETE CASCADE,
  PRIMARY KEY (document_id, source_id)
);

CREATE TABLE paragraph (
  id autouuid PRIMARY KEY,
  page_id uuid NOT NULL REFERENCES document_page (id) ON DELETE CASCADE,
  character_range int8range NOT NULL,
  english_translation text NOT NULL
);

CREATE TABLE word (
  id autouuid PRIMARY KEY,
  source_text text NOT NULL,
  simple_phonetics text,
  phonemic text,
  english_gloss text,
  recorded_at date,
  commentary text,
  audio_slice_id uuid REFERENCES audio_slice (id) ON DELETE SET NULL,
  -- Position of the word within a document.
  document_id uuid NOT NULL REFERENCES document (id) ON DELETE CASCADE,
  page_number text,
  index_in_document bigint not null,
  -- Position of the word on a physical page.
  page_id uuid REFERENCES document_page (id) ON DELETE CASCADE,
  -- Order of words in the paragraph is determined by character indices.
  character_range int8range,
  -- If this word is on a specific page, it must also have a character range.
  CONSTRAINT word_page_position CHECK (page_id IS NULL OR character_range IS NOT NULL),
  UNIQUE (document_id, index_in_document)
);

CREATE TABLE abbreviation_system (
  id autouuid PRIMARY KEY,
  -- TODO Once we have live data, either remove this field or make it non-unique.
  short_name text not null unique,
  title text NOT NULL
);

CREATE TABLE abstract_morpheme_tag (
  id autouuid primary key,
  -- Necessary for idempotent spreadsheet migrations.
  -- TODO Remove this once we aren't relying on spreadsheets.
  internal_gloss text not null unique,
  linguistic_type text,
  description text
);

CREATE TABLE morpheme_tag (
  id autouuid PRIMARY KEY,
  system_id uuid NOT NULL REFERENCES abbreviation_system (id),
  abstract_ids uuid[] NOT NULL,
  gloss text not null,
  title text not null,
  -- TODO Remove this unique constraint once we aren't reliant on spreadsheets
  constraint morpheme_tag_unique unique (system_id, abstract_ids)
);

CREATE TYPE segment_type AS enum (
  'Morpheme',
  'Clitic'
);

-- Used for glossing related morphemes within a document.
-- So within WJ46, if I want to gloss two words as "walk" because they are the
-- same lexical unit, then both words use the same morpheme_gloss instance.
-- For example, one might be "WJ46:walk" which displays as "walk" within that document.
--
-- This table is could also be used for lexical entries within DF1975.
CREATE TABLE morpheme_gloss (
  id autouuid PRIMARY KEY,
  document_id uuid REFERENCES document (id) ON DELETE CASCADE,
  gloss text NOT NULL,
  -- Each gloss is unique within its parent document.
  UNIQUE (document_id, gloss),
  example_shape text,
  tag_id uuid references abstract_morpheme_tag (id) on delete set null
);


CREATE TABLE word_segment (
  id autouuid PRIMARY KEY,
  word_id uuid NOT NULL REFERENCES word (id) ON DELETE CASCADE,
  index_in_word bigint NOT NULL,
  morpheme text NOT NULL,
  gloss_id uuid NOT NULL REFERENCES morpheme_gloss (id) ON DELETE RESTRICT,
  -- TODO might be able to replace this with type of current segment.
  followed_by segment_type,
  UNIQUE (word_id, index_in_word)
);

-- Connect two morpheme glosses, i.e. "WJ46:walk" and "DF1975:walk"
CREATE TABLE morpheme_gloss_relation (
  left_gloss_id uuid not null references morpheme_gloss (id) on delete cascade,
  right_gloss_id uuid not null references morpheme_gloss (id) on delete cascade,
  PRIMARY KEY (left_gloss_id, right_gloss_id)
);

-- Should we also be able to connect full words?
-- Should I focus on connecting words instead of morphemes?
-- Connecting words is probably easier but we'll definitely be connecting
-- morphemes for the functional ones like suffixes.
