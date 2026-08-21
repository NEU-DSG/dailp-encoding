-- Mark all refresh tokens for a user as revoked
-- Used after password reset for security
update refresh_tokens
set revoked = true
where user_id = $1;