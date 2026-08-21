-- Get password reset token if valid
select 
    prt.id,
    prt.user_id,
    prt.token_hash,
    prt.expires_at,
    prt.used,
    u.email
from password_reset_tokens prt
join dailp_user u on prt.user_id = u.id
where prt.token_hash = $1
  and prt.used = false
  and prt.expires_at > now();