insert into dailp_user (display_name, created_at, avatar_url, bio, organization, location, role)
values ($1, $2, $3, $4, $5, $6, $7)
returning id