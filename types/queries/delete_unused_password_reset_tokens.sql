-- Delete old unused tokens first
delete from password_reset_tokens 
where user_id = $1 and used = false;