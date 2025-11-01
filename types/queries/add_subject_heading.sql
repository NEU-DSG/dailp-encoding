-- Add a new subject heading ('pending' status by default)
insert into subject_heading (name, status)
values ($1, coalesce($2, 'pending'::approval_status))
returning id;