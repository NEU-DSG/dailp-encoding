-- Mark user's email as verified
update dailp_user
set email_verified = true
where id = $1
returning id;