-- Always use bigint instead of int.
-- https://blog.rustprooflabs.com/2021/06/postgres-bigint-by-default

create extension if not exists "uuid-ossp";

-- Prevent error if migration is reapplied on database that already has autouuid
do $$
begin
  if not exists (select 1 from pg_type where typname = 'autouuid') then
    create domain autouuid as uuid default uuid_generate_v4 ();
  end if;
end$$;

-- Base website: Language > Group > Document
-- CWKW: Collection > Chapter > Sub-chapter > Page + Document

create table document_group (
  id autouuid primary key,
  slug text not null unique,
  title text not null
);

create table media_resource (
  id autouuid primary key,
  url text not null unique,
  recorded_at date
);

create table media_slice (
  id autouuid primary key,
  resource_id uuid not null references media_resource (id) on delete cascade,
  time_range int8range
);

create table document (
  id autouuid primary key,
  short_name text not null unique,
  title text not null,
  group_id uuid not null references document_group (id) on delete cascade,
  index_in_group bigint not null default 0,
  is_reference boolean not null,
  written_at date,
  audio_slice_id uuid references media_slice (id) on delete set null
);

create table iiif_source (
  id autouuid primary key,
  title text not null,
  base_url text not null unique
);

create table document_page (
  id autouuid primary key,
  document_id uuid not null references document (id) on delete cascade,
  index_in_document bigint not null,
  iiif_source_id uuid references iiif_source (id),
  iiif_oid text,
  constraint document_page_iiif_image_has_id check (iiif_source_id is null or iiif_oid is not null),
  unique (document_id, index_in_document)
);

-- TODO Model character-based transcriptions first!
create table character_transcription (
  id autouuid primary key,
  page_id uuid not null references document_page (id) on delete cascade,
  index_in_page bigint not null,
  possible_transcriptions text[] not null,
  image_area box
);

-- Used both for known static contributors and active users.
create table contributor (
  id autouuid primary key,
  full_name text not null unique
);

create table contributor_attribution (
  document_id uuid not null references document (id) on delete cascade,
  contributor_id uuid not null references contributor (id) on delete cascade,
  contribution_role text not null,
  primary key (document_id, contributor_id)
);

create table document_source (
  id autouuid primary key,
  name text not null,
  url text not null
);

-- This table bridges from documents to sources.
create table document_source_citation (
  document_id uuid not null references document (id) on delete cascade,
  source_id uuid not null references document_source (id) on delete cascade,
  primary key (document_id, source_id)
);

create table paragraph (
  id autouuid primary key,
  page_id uuid not null references document_page (id) on delete cascade,
  character_range int8range not null,
  english_translation text not null
);

create table word (
  id autouuid primary key,
  source_text text not null,
  simple_phonetics text,
  phonemic text,
  english_gloss text,
  recorded_at date,
  commentary text,
  audio_slice_id uuid references media_slice (id) on delete set null,
  -- Position of the word within a document.
  document_id uuid not null references document (id) on delete cascade,
  page_number text,
  index_in_document bigint not null,
  -- Position of the word on a physical page.
  page_id uuid references document_page (id) on delete cascade,
  -- Order of words in the paragraph is determined by character indices.
  character_range int8range,
  -- If this word is on a specific page, it must also have a character range.
  constraint word_page_position check (page_id is null or character_range is not null),
  unique (document_id, index_in_document)
);

create table abbreviation_system (
  id autouuid primary key,
  -- TODO Once we have live data, either remove this field or make it non-unique.
  short_name text not null unique,
  title text not null
);

create table abstract_morpheme_tag (
  id autouuid primary key,
  -- Necessary for idempotent spreadsheet migrations.
  -- TODO Remove this once we aren't relying on spreadsheets.
  internal_gloss text not null unique,
  linguistic_type text,
  description text
);

create table morpheme_tag (
  id autouuid primary key,
  system_id uuid not null references abbreviation_system (id),
  abstract_ids uuid[] not null,
  gloss text not null,
  title text not null,
  -- TODO Remove this unique constraint once we aren't reliant on spreadsheets
  constraint morpheme_tag_unique unique (system_id, abstract_ids)
);

create type segment_type as enum (
  'Morpheme',
  'Clitic'
);

-- Used for glossing related morphemes within a document.
-- So within WJ46, if I want to gloss two words as "walk" because they are the
-- same lexical unit, then both words use the same morpheme_gloss instance.
-- For example, one might be "WJ46:walk" which displays as "walk" within that document.
--
-- This table is could also be used for lexical entries within DF1975.
create table morpheme_gloss (
  id autouuid primary key,
  document_id uuid references document (id) on delete cascade,
  gloss text not null,
  -- Each gloss is unique within its parent document.
  unique (document_id, gloss),
  example_shape text,
  tag_id uuid references abstract_morpheme_tag (id) on delete set null
);


create table word_segment (
  id autouuid primary key,
  word_id uuid not null references word (id) on delete cascade,
  index_in_word bigint not null,
  morpheme text not null,
  gloss_id uuid not null references morpheme_gloss (id) on delete restrict,
  -- TODO might be able to replace this with type of current segment.
  followed_by segment_type,
  unique (word_id, index_in_word)
);

-- Connect two morpheme glosses, i.e. "WJ46:walk" and "DF1975:walk"
create table morpheme_gloss_relation (
  left_gloss_id uuid not null references morpheme_gloss (id) on delete cascade,
  right_gloss_id uuid not null references morpheme_gloss (id) on delete cascade,
  primary key (left_gloss_id, right_gloss_id)
);

-- Should we also be able to connect full words?
-- Should I focus on connecting words instead of morphemes?
-- Connecting words is probably easier but we'll definitely be connecting
-- morphemes for the functional ones like suffixes.