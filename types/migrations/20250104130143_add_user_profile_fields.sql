alter table dailp_user
    add column avatar_url text,
    add column bio text,
    add column organization text,
    add column location text,
    add column role text not null DEFAULT 'READER'