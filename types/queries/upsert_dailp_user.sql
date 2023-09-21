insert into dailp_user (id, display_name, created_at)
values (
    -- hint for uuid type instead of autouuid (column type), which can't be used
    -- as a parameter
    $1::uuid,
    '',
    now()
)
on conflict do nothing;
