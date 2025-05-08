-- Create tables and columns needed to have user contributed audio for a whole document

-- add columns for "editing" (hiding/showing) audio ingested from recording sessions
alter table document
  add column include_audio_in_edited_collection boolean not null DEFAULT true,
  add column audio_edited_by uuid,
  add constraint audio_edited_by_fkey
    foreign key (audio_edited_by)
    references dailp_user (id)
    on delete set null;

-- create a join table for user contributed audio slices
create table document_user_media (
    document_id uuid not null references document (id) on delete cascade,
    media_slice_id uuid not null references media_slice (id) on delete cascade,
    include_in_edited_collection boolean not null DEFAULT false,
    edited_by uuid references dailp_user (id) on delete set null,
    primary key (document_id, media_slice_id)
);