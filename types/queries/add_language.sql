-- Add a new language ('pending' status by default)
insert into language (name, autonym, status)
values ($1, $2, coalesce($3, 'pending'::approval_status))
returning id;