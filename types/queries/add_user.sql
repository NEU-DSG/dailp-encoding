insert into dailp_user (display_name, created_at, role)
values ($1, now(), $2::text::user_role)
returning id
