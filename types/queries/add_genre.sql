-- Add a new genre ('pending' status by default)
insert into genre (name, status)
values ($1, coalesce($2, 'pending'::approval_status))
returning id;