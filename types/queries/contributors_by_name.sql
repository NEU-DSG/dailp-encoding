select id, full_name
from contributor
where full_name = any($1)
