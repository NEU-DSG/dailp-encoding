-- Create language table if it doesn't exist
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