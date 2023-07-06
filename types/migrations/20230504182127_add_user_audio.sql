-- Add migration script here

create table dailp_user (
  id autouuid primary key,
  display_name text not null,
  created_at date not null
);

alter table media_resource
    add column recorded_by uuid,
    add constraint recorded_by_fkey foreign key (recorded_by) references dailp_user (id) on delete set null;


create table word_user_media (
    word_id uuid not null references word (id) on delete cascade,
    media_slice_id uuid not null references media_slice (id) on delete cascade,
    include_in_edited_collection boolean not null DEFAULT false,
    edited_by uuid references dailp_user (id) on delete set null,
    primary key (word_id, media_slice_id)
);