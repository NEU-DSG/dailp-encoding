-- Add a new format ('pending' status by default)
insert into doc_format (name, status)
values ($1, coalesce($2, 'pending'::approval_status))
returning id;
