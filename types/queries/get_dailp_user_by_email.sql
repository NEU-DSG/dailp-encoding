-- Get user by email for authentication
-- Returns user data including password_hash for verification
select id, email, password_hash, email_verified, role::text as role, display_name, created_at
from dailp_user
where email = $1;