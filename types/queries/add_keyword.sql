-- Add a new keyword ('pending' status by default)
insert into keyword (name, status)
values ($1, coalesce($2, 'pending'::approval_status))
returning id;