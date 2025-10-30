-- Create a new refresh token (session)
-- $1 = user_id, $2 = token_hash, $3 = expires_at
-- Optionally: $4 = user_agent, $5 = ip_address (if you add those params)
insert into refresh_tokens (user_id, token_hash, expires_at)
values ($1, $2, $3)
returning id;