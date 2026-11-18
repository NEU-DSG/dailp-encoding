-- Create format table if it doesn't exist
create table if not exists doc_format (
    id autouuid primary key,
    name text not null,
    status approval_status default 'pending'
);

-- Add FK from document to format
alter table if exists document
  add column if not exists format_id uuid null references doc_format(id);