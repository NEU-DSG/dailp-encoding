select evt.id, evt.user_id, evt.token_hash, evt.expires_at, evt.used, u.email
from email_verification_tokens evt
join dailp_user u on evt.user_id = u.id
where evt.token_hash = $1
  and evt.used = false
  and evt.expires_at > now();