-- Create subject heading table if it doesn't exist
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