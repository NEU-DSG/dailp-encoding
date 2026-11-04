-- Create associated person table if it doesn't exist
create table if not exists associated_person (
 id autouuid primary key,
 name text not null unique
);

-- Join table between document and associated person to map which people are
-- associated with which documents
create table if not exists document_associated_person (
 document_id uuid not null references document(id) on delete cascade,
 associated_person_id uuid not null references associated_person(id) on delete cascade,
 primary key (document_id, associated_person_id)
);
