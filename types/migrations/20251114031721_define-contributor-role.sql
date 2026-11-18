-- Defines contributor roles
drop type if exists contributor_role cascade;
create type contributor_role as enum (
  'transcriber', 
  'translator', 
  'annotator',
  'cultural_advisor'
);