-- Create keyword table if it doesn't exist
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