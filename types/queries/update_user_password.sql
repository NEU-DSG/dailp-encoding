-- Update user's password hash
update dailp_user
set password_hash = $2
where id = $1
returning id;