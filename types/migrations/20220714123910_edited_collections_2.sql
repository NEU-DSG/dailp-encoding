-- Add migration script here
create type collection_section as enum ('Intro', 'Body');

alter table collection_chapter
    add section collection_section;
    