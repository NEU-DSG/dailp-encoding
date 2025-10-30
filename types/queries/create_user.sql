-- Create a new user account
-- Returns the user_id
insert into dailp_user (id, email, password_hash, email_verified)
values (gen_random_uuid(), $1, $2, false)
returning id;