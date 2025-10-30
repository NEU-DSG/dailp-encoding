select 
    id, 
    name, 
    status::text as status
from genre
where id = $1;