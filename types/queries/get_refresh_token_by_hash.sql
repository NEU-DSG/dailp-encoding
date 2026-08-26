-- Validate and retrieve refresh token
-- Returns NULL if token doesn't exist, is expired, or is revoked
select 
    rt.id,
    rt.user_id,
    rt.token_hash,
    rt.expires_at,
    rt.created_at,
    rt.last_used_at,
    rt.revoked,
    u.email,
    u.role::text as role,
    u.display_name
from refresh_tokens rt
join dailp_user u on rt.user_id = u.id
where rt.token_hash = $1
  and rt.revoked = false
  and rt.expires_at > now();