-- Create a new user account and auto generates a display name based on the email. Can be changed later.
-- Returns the user_id
insert into dailp_user (id, email, password_hash, email_verified, display_name, created_at)
values (gen_random_uuid(), $1, $2, false, split_part($1, '@', 1), CURRENT_DATE)
returning id;