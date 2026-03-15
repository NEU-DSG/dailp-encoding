insert into dailp_user (id, display_name, created_at, role)
values ($1::uuid, $2, now(), $3::text::user_role)
returning id
