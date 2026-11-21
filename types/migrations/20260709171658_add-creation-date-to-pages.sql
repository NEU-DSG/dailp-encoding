alter table page
add column if not exists created_at date not null default current_date;