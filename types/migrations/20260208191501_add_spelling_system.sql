create table spelling_system (
    id uuid primary key default gen_random_uuid(),
    name text not null unique
);

create table word_spelling (
    word_id uuid not null references word(id) on delete cascade,
    spelling_system uuid not null references spelling_system(id) on delete cascade,
    value text not null,
    primary key (word_id, spelling_system)
);

insert into spelling_system (name) values
    ('Source'),
    ('Simple Phonetics');

alter table word drop column source_text;
alter table word drop column simple_phonetics;