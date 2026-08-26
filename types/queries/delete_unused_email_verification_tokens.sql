-- Delete old unused tokens first
delete from email_verification_tokens 
where user_id = $1 and used = false;