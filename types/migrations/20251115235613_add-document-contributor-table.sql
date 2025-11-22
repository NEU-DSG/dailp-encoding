-- Join table between document and contributor to map which contruibutors are 
-- associated with which documents
create table if not exists document_contributor (
  document_id uuid not null references document(id) on delete cascade,
  contributor_id uuid not null references contributor(id) on delete cascade,
  primary key (document_id, contributor_id)
);