-- Menus
create table if not exists menu (
    id autouuid primary key,
    name text not null,
    slug text not null unique,
    items jsonb not null
);
