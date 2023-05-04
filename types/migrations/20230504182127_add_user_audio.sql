-- Add migration script here

create table dailp_user (
  id autouuid primary key,
  display_name text not null,
  created_at date not null
);

alter table media_resource
    add column recorded_by uuid,
    add constraint recorded_by_fkey foreign key (recorded_by) references dailp_user (id) on delete set null;


alter table word
    add column curated_audio_slice_id uuid,
    add constraint curated_audio_slice_id_fkey
        foreign key (curated_audio_slice_id) references media_slice (id) on delete set null,
    add column audio_curated_by uuid,
    add constraint audio_curated_by_fkey
        foreign key (audio_curated_by) references dailp_user (id) on delete set null;


create table word_user_media (
    word_id uuid not null references word (id) on delete cascade,
    media_slice_id uuid not null references media_slice (id) on delete cascade,
    primary key (word_id, media_slice_id)
);