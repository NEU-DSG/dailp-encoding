-- Mark reset token as used and update password
-- This should be in a transaction with the password update
update password_reset_tokens
set used = true
where id = $1
returning user_id;