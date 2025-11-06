create table email_verification_tokens (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references dailp_user(id) on delete cascade,
    token_hash text not null unique,
    expires_at timestamp with time zone not null,
    created_at timestamp with time zone not null default now(),
    used boolean not null default false
);

create index idx_email_verification_tokens_user_id on email_verification_tokens(user_id);
create index idx_email_verification_tokens_token_hash on email_verification_tokens(token_hash);
create index idx_email_verification_tokens_expires_at on email_verification_tokens(expires_at);