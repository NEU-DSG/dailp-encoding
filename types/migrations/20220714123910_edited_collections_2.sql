-- Add migration script here
create type chapter_t as enum ('intro', 'body');

alter table collection_chapter
    add chapter_type chapter_t;
    