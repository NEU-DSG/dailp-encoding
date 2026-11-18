-- Create creator table if it doesn't exist
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