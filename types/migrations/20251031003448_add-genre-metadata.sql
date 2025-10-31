-- Create genre table if it doesn’t exist
create table if not exists genre (
    id autouuid primary key,
    name text not null,
    status approval_status default 'pending'
);

-- Add FK from document to genre
alter table if exists document
  add column if not exists genre_id uuid null references genre(id);