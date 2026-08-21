-- Update last_used_at when token is used to refresh access token
update refresh_tokens
set last_used_at = now()
where token_hash = $1;