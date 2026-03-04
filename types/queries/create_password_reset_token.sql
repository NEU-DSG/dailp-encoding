-- Insert new token
insert into password_reset_tokens (user_id, token_hash, expires_at)
values ($1, $2, $3)
returning id;