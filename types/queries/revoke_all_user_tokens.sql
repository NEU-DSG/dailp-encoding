-- Revoke all tokens for a user (used on password change)
update refresh_tokens
set revoked = true
where user_id = $1
  and revoked = false
returning id;