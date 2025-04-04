SELECT 
  id, 
  display_name, 
  created_at, 
  avatar_url, 
  bio, 
  organization, 
  location, 
  role::text as role
FROM dailp_user
WHERE id = $1