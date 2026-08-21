-- Create key date table if it doesn't exist
create table if not exists key_date (
  id autouuid primary key,
  name text not null unique
);

-- Join table between document and key date to map which key dates are 
-- associated with which documents
create table if not exists document_key_date (
  document_id uuid not null references document(id) on delete cascade,
  key_date_id uuid not null references key_date(id) on delete cascade,
  primary key (document_id, key_date_id)
);