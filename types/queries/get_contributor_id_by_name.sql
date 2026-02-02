-- Get contributor ID from name
select id from contributor where full_name = $1;