with resource as (
  insert into media_resource (url)
  values ($1)
  on conflict (url) do update set
     url = excluded.url
  returning id
)

insert into media_slice (resource_id, time_range)
select
  id,
  $2
from resource
returning id
