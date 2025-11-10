-- Add migration script here
-- All of these in-house account specific columns
-- must be nullable to ensure cognito compatibility
alter table dailp_user
    add column email text unique,
    add column password_hash text,
    add column email_verified boolean default false;

create table refresh_tokens (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references dailp_user(id) on delete cascade,
    token_hash text not null unique,  -- hashed version of the refresh token
    expires_at timestamp with time zone not null,
    created_at timestamp with time zone not null default now(),
    last_used_at timestamp with time zone,
    revoked boolean not null default false
);

create index idx_refresh_tokens_user_id on refresh_tokens(user_id);
create index idx_refresh_tokens_token_hash on refresh_tokens(token_hash);
create index idx_refresh_tokens_expires_at on refresh_tokens(expires_at);

create table password_reset_tokens (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references dailp_user(id) on delete cascade,
    token_hash text not null unique,
    expires_at timestamp with time zone not null,
    created_at timestamp with time zone not null default now(),
    used boolean not null default false
);

create index idx_password_reset_tokens_user_id on password_reset_tokens(user_id);
create index idx_password_reset_tokens_token_hash on password_reset_tokens(token_hash);
create index idx_password_reset_tokens_expires_at on password_reset_tokens(expires_at);