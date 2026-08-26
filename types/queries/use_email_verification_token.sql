update email_verification_tokens
set used = true
where id = $1
returning user_id;