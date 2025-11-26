-- Add a new spatial coverage ('pending' status by default)
insert into spatial_coverage (name, status)
values ($1, coalesce($2, 'pending'::approval_status))
returning id;