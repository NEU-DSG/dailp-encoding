-- https://blog.rustprooflabs.com/2021/06/postgres-bigint-by-default
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE DOMAIN autoid uuid DEFAULT uuid_generate_v4 ();

CREATE TABLE super_collection (
  slug text PRIMARY KEY,
  title text NOT NULL
);

INSERT INTO super_collection (slug, title)
  VALUES ('', 'Cherokee Documents');

CREATE TABLE collection (
  id autoid PRIMARY KEY,
  super_collection text NOT NULL REFERENCES super_collection (slug) ON DELETE CASCADE ON UPDATE CASCADE,
  -- Allow sub-collections. Collections with null parent are top-level.
  parent_id uuid REFERENCES collection (id) ON DELETE CASCADE,
  index_in_parent bigint NOT NULL DEFAULT 0,
  slug text NOT NULL,
  title text NOT NULL,
  UNIQUE (super_collection, slug)
);

CREATE TABLE audio_resource (
  id autoid PRIMARY KEY,
  url text NOT NULL,
  recorded_at date
);

CREATE TABLE audio_slice (
  id autoid PRIMARY KEY,
  resource_id uuid NOT NULL REFERENCES audio_resource (id) ON DELETE CASCADE,
  time_range int8range
);

CREATE TABLE document (
  id text PRIMARY KEY,
  title text NOT NULL,
  is_reference boolean NOT NULL,
  written_at date,
  audio_slice_id uuid REFERENCES audio_slice (id) ON DELETE SET NULL
);

CREATE TABLE iiif_source (
  id autoid PRIMARY KEY,
  title text NOT NULL,
  base_url text NOT NULL
);

-- TODO consider grouping paragraphs into pages which then have associated images.
CREATE TABLE document_page (
  id autoid PRIMARY KEY,
  document_id text NOT NULL REFERENCES document (id) ON DELETE CASCADE,
  index_in_document bigint NOT NULL,
  iiif_source_id uuid REFERENCES iiif_source (id),
  iiif_oid text,
  CONSTRAINT iiif_image_has_id CHECK (iiif_source_id IS NULL OR iiif_oid IS NOT NULL)
);

-- TODO Model character-based transcriptions first!
CREATE TABLE character_transcription (
  id autoid PRIMARY KEY,
  page_id uuid NOT NULL REFERENCES document_page (id) ON DELETE CASCADE,
  index_in_page bigint NOT NULL,
  possible_transcriptions text[],
  image_area box,
  UNIQUE (page_id, index_in_page)
);

-- Place a document within a collection.
CREATE TABLE document_collection_position (
  collection_id uuid NOT NULL REFERENCES collection (id) ON DELETE CASCADE,
  document_id text NOT NULL REFERENCES document (id) ON DELETE CASCADE,
  index_in_collection bigint NOT NULL,
  -- TODO Add associated description
  -- TODO Figure out what other fields need to live here.
  PRIMARY KEY (collection_id, document_id),
  UNIQUE (collection_id, index_in_collection)
);

-- Used both for known static contributors and active users.
CREATE TABLE contributor_info (
  id autoid PRIMARY KEY,
  full_name text NOT NULL
);

CREATE TABLE contributor_attribution (
  document_id text NOT NULL REFERENCES document (id) ON DELETE CASCADE,
  contributor_id uuid NOT NULL REFERENCES contributor_info (id) ON DELETE CASCADE,
  contribution_role text NOT NULL,
  PRIMARY KEY (document_id, contributor_id)
);

CREATE TABLE document_source (
  id autoid PRIMARY KEY,
  name text NOT NULL,
  url text NOT NULL
);

-- This table bridges from documents to sources.
CREATE TABLE document_source_citation (
  document_id text NOT NULL REFERENCES document (id) ON DELETE CASCADE,
  source_id uuid NOT NULL REFERENCES document_source (id) ON DELETE CASCADE,
  PRIMARY KEY (document_id, source_id)
);

CREATE TABLE paragraph (
  id autoid PRIMARY KEY,
  page_id uuid NOT NULL REFERENCES document_page (id) ON DELETE CASCADE,
  character_range int8range NOT NULL,
  english_translation text NOT NULL
);

CREATE TABLE word (
  id autoid PRIMARY KEY,
  source_text text NOT NULL,
  simple_phonetics text,
  phonemic text,
  english_gloss text,
  recorded_at date,
  commentary text,
  audio_slice_id uuid REFERENCES audio_slice (id) ON DELETE SET NULL,
  -- Position of the word within a document.
  document_id text NOT NULL REFERENCES document (id) ON DELETE CASCADE,
  page_number text,
  index_in_document bigint,
  -- Position of the word on a physical page.
  page_id uuid REFERENCES document_page (id) ON DELETE SET NULL,
  -- Order of words in the paragraph is determined by character indices.
  character_range int8range,
  -- If this word is on a specific page, it must also have a character range.
  CONSTRAINT word_page_position CHECK (page_id IS NULL OR character_range IS NOT NULL)
);

CREATE TABLE morpheme_tag_system (
  id autoid PRIMARY KEY,
  system_name text NOT NULL
);

CREATE TABLE abstract_morpheme_tag (
  tag text PRIMARY KEY,
  morpheme_type text,
  description text
);

CREATE TABLE morpheme_tag (
  id autoid PRIMARY KEY,
  abstract_id text NOT NULL REFERENCES abstract_morpheme_tag (tag),
  tag_system_id uuid NOT NULL REFERENCES morpheme_tag_system (id),
  UNIQUE (abstract_id, tag_system_id)
);

CREATE TYPE segment_type AS enum (
  'Morpheme',
  'Clitic'
);

CREATE TABLE word_segment (
  id autoid PRIMARY KEY,
  word_id uuid NOT NULL REFERENCES word (id) ON DELETE CASCADE,
  index_in_word bigint NOT NULL,
  morpheme text NOT NULL,
  -- May or may not be a reference to morpheme_tag
  -- TODO Add an extra field for referring to abstract_morpheme_tag
  gloss text NOT NULL,
  -- TODO might be able to replace this with type of current segment.
  followed_by segment_type,
  UNIQUE (word_id, index_in_word)
);

-- Used for glossing related morphemes within a document.
-- So within WJ46, if I want to gloss two words as "walk" because they are the
-- same lexical unit, then both words use the same morpheme_gloss instance.
-- For example, one might be "WJ46:walk" which displays as "walk" within that document.
--
-- This table is could also be used for lexical entries within DF1975.
CREATE TABLE morpheme_gloss (
  id autoid PRIMARY KEY,
  document_id text REFERENCES document (id) ON DELETE CASCADE,
  gloss text NOT NULL,
  example_shape text,
  -- Each gloss is unique within its parent document.
  UNIQUE (document_id, gloss)
);

-- Connect two morpheme glosses, i.e. "WJ46:walk" and "DF1975:walk"
CREATE TABLE morpheme_gloss_relation (
  left_document_id text NOT NULL,
  left_gloss text NOT NULL,
  FOREIGN KEY (left_document_id, left_gloss) REFERENCES morpheme_gloss (document_id, gloss) ON DELETE CASCADE,
  right_document_id text NOT NULL,
  right_gloss text NOT NULL,
  FOREIGN KEY (right_document_id, right_gloss) REFERENCES morpheme_gloss (document_id, gloss) ON DELETE CASCADE,
  PRIMARY KEY (left_document_id, left_gloss, right_document_id, right_gloss)
);

-- Should we also be able to connect full words?
-- Should I focus on connecting words instead of morphemes?
-- Connecting words is probably easier but we'll definitely be connecting
-- morphemes for the functional ones like suffixes.
