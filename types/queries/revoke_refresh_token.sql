-- Revoke a refresh token (logout)
-- Returns the user_id if token was found and revoked, NULL otherwise
update refresh_tokens
set revoked = true
where token_hash = $1
  and revoked = false
returning user_id;